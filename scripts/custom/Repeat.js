// Repeats a given function at the specified interval in wait.
// Looping is actually done through the Repeat class, not the Repeat instances.

var Repeat = function(	wait,
						action	){
	this.action = action;
	this.wait = wait;
	this.count = 0;
	this.running = false;

	this.ID = Repeat.IdGenerator ++;
	Repeat.chain.push(this);
}

Repeat.IdGenerator = 0;
Repeat.loopRunning = false;
Repeat.chain = [];
Repeat.requestID = null;

Repeat.loop = function() {
	var repeater;

	for (var i = 0; i < Repeat.chain.length; i ++) {
		repeater = Repeat.chain[i];

		if (repeater.running) {
			if (repeater.count % repeater.wait == 0){
				repeater.count = 0;
				repeater.action();
			}

			repeater.count++;
		}
	}

	Repeat.requestID = window.requestAnimationFrame(Repeat.loop);
}

Repeat.prototype.stop = function() {
	this.running = false;

	if (Repeat.allStopped()) {
		Repeat.loopRunning = false;
		Repeat.stopLoop();
	}
}

Repeat.stopLoop = function() {
	if (Repeat.requestID != null){
		window.cancelAnimationFrame(Repeat.requestID);
	}
}

Repeat.allStopped = function() {
	for (var i = 0; i < Repeat.chain.length; i++) {
		if (Repeat.chain[i].running) {
			return false;
		}
	}

	return true;
}

Repeat.prototype.start = function() {
	this.running = true;

	if (!Repeat.loopRunning) {
		Repeat.loopRunning = true;
		Repeat.loop();
	}
}

// Removes the object with the same ID from Repeat.chain
Repeat.prototype.remove = function() {
	Repeat.chain = Repeat.chain.filter(function(element) {
		element.ID != this.ID;
	}, this);

	this.action = null;

	if (Repeat.allStopped) {
		Repeat.stopLoop();
	}
}
