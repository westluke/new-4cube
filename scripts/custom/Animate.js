// Calls mutative methods on data, graph, ui

var Animation = function(	animateWait,
							pointWait,
							gl,
							data,
							graph,
							ui) {

	this.gl = gl;
	this.data = data;
	this.graph = graph;
	this.ui = ui;

	// Flags that inform the object of whether or not the render loop is running,
	// and whether or not the graph is being animated in the loop.
	this.animating = false;
	this.rendering = false;

	// Determines how long to wait between animations of the graph. Can be used to
	// lighten gpu and memory load.
	this.animateWait = animateWait;
	this.animateCount = 0;

	// The ID of the animation request
	this.requestID = null;

	// Similar variables for the constant updating of the points display while it is active.
	this.updatingPoints = false;
	this.pointWait = pointWait;
	this.pointCount = 0;
	this.pointsRequestID = null;
}

// This function generates an anonymous function that already knows about the variable ani.
// This means that it can be passed to window for execution without losing access to Animation variables.
// From within the Animation class, it is called with "this" as the ani argument.
Animation.prototype.loop = function (ani) {
	return function() {
		if (ani.rendering){
			if (ani.animating){
				if (ani.animateCount % ani.animateWait == 0){
					ani.animate();
				}
				ani.animateCount ++;
			}

			ani.gl.updateControls();
			ani.gl.moveLightToCamera();
			ani.gl.render();

			ani.requestID = window.requestAnimationFrame(ani.loop(ani));
		}
	}
}

Animation.prototype.pointsUpdateLoop = function (ani) {
	return function() {
		if (ani.updatingPoints){
			ani.ui.updatePoints();
			ani.pointsRequestID = window.requestAnimationFrame(ani.pointsUpdateLoop(ani));
		}
	}
}

// These do not start new render loops unless they have to.
Animation.prototype.startRender = function() {
	if (!this.rendering){
		this.rendering = true;
		this.requestID = window.requestAnimationFrame(this.loop(this));
	}
}

Animation.prototype.startRenderAndAnimate = function() {
	this.animating = true;

	if (!this.rendering){
		this.rendering = true;
		this.requestID = window.requestAnimationFrame(this.loop(this));
	}
}

Animation.prototype.stopRenderAndAnimate = function() {
	this.animating = false;
	this.rendering = false;

	if (this.requestID){
		window.cancelAnimationFrame(this.requestID);
		this.requestID = null;
	}
}

Animation.prototype.stopAnimate = function() {
	this.animating = false;
}

Animation.prototype.setAnimateWait = function(wait){
	this.animateWait = wait;
}

Animation.prototype.animate = function() {
	this.gl.mesh.rotation.x += 0.01;
}

Animation.prototype.startPointsUpdate = function() {
	if (!this.updatingPoints){
		this.updatingPoints = true;
		this.pointsRequestID = window.requestAnimationFrame(this.pointsUpdateLoop(this));
	}
}

Animation.prototype.stopPointsUpdate = function() {
	this.updatingPoints = false;

	if (this.pointsRequestID){
		window.cancelAnimationFrame(this.pointsRequestID);
		this.pointsRequestID = null;
	}
}
