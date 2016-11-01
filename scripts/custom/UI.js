var UI = function (	data,
					graph) {
	this.data = data;
	this.graph = graph;

	this.manualKeep = null;
	this.manualGUI = null;

	this.animationKeep = null;
	this.animationGUI = null;

	this.geoKeep = null;
	this.geoGUI = null;

	this.pointsKeep = null;
	this.pointsGUI = null;

	this.initManual();
	this.initAnimation();
	this.initGeo();
	this.initPoints();

	this.nextPointIndex = 0;
}

// An object to store settings of any kind
UI.prototype.Keep = function(props) {
	Object.keys(props).forEach(function(key) {
		this[key] = props[key];
	}, this);
}

// Initalize the manual section of the settings page
UI.prototype.initManual = function() {
	this.manualKeep = new this.Keep({
		xy: 0.1,
		yz: 0.1,
		zx: 0.1,
		xw: 0.1,
		wy: 0.1,
		wz: 0.1
	});

	this.manualGUI = new dat.GUI();

	this.manualGUI.add(this.manualKeep, "xy", -6.28, 6.28).listen();
	this.manualGUI.add(this.manualKeep, "yz", -6.28, 6.28).listen();
	this.manualGUI.add(this.manualKeep, "zx", -6.28, 6.28).listen();
	this.manualGUI.add(this.manualKeep, "xw", -6.28, 6.28).listen();
	this.manualGUI.add(this.manualKeep, "wy", -6.28, 6.28).listen();
	this.manualGUI.add(this.manualKeep, "wz", -6.28, 6.28).listen();

	Object.keys(this.manualKeep).forEach(function(key){
		this.manualKeep[key] = 0.0;
	}, this);

	document.getElementById("manual-gui").appendChild(this.manualGUI.domElement);
	$("#manual-control .cr").prepend("<button class='apply-button'>Apply</button> ");

	var context = this;

	$(".cr .apply-button").click(function(event) {
		var key = $(event.target).parent().find("span.property-name").text();
		var value = context.manualKeep[key];
		context.data.transform(Matrix[key] (value));
	});
}

// Initialize the animation section of the settings div
UI.prototype.initAnimation = function() {
	this.animationKeep = new this.Keep({
		xy: 0.1,
		yz: 0.1,
		zx: 0.1,
		xw: 0.1,
		wy: 0.1,
		wz: 0.1,
		"skipped renders": 0,
	});

	this.animationGUI = new dat.GUI();

	this.animationGUI.add(this.animationKeep, "xy", -6.28, 6.28).listen();
	this.animationGUI.add(this.animationKeep, "yz", -6.28, 6.28).listen();
	this.animationGUI.add(this.animationKeep, "zx", -6.28, 6.28).listen();
	this.animationGUI.add(this.animationKeep, "xw", -6.28, 6.28).listen();
	this.animationGUI.add(this.animationKeep, "wy", -6.28, 6.28).listen();
	this.animationGUI.add(this.animationKeep, "wz", -6.28, 6.28).listen();

	Object.keys(this.animationKeep).forEach(function(key){
		this.animationKeep[key] = 0.0;
	}, this);

	var context = this;


	// The cube animation needs to update every time one of these values is changed.
	for (var i = 0; i < 6; i++) {
		this.animationGUI.__controllers[i].onChange(function (value) {
			context.data.setTransform(this.property, value/60);
			context.data.produceCurrentTransform();
		})
	}

	this.animationKeep.xw = 0.5;

	// initial settings to produce a nice rotation
	this.data.setTransform("xw", 0.5 / 60);
	this.data.produceCurrentTransform();

	document.getElementById("animation-gui").appendChild(this.animationGUI.domElement);
}

UI.prototype.initGeo = function() {
	this.geoKeep = new this.Keep({
		color: [237, 87, 73],
		wireframe: false,
		radius: 0.04,
		"sphere segments": 8,
		"tube segments": 20
	});

	this.geoGUI = new dat.GUI();

	// color is special case
	this.geoGUI.addColor(this.geoKeep, "color").listen();
	this.geoGUI.add(this.geoKeep, "wireframe").listen();
	this.geoGUI.add(this.geoKeep, "radius", 0.02, 1).listen().step(0.02);
	this.geoGUI.add(this.geoKeep, "sphere segments", 3, 15).listen().step(1);
	this.geoGUI.add(this.geoKeep, "tube segments", 3, 30).listen().step(1);

	var context = this;

	// update materials on changes to the first two controllers.
	for (var i = 0; i < 2; i++){
		this.geoGUI.__controllers[i].onChange(function() {
			context.graph.updateMaterials(context.geoKeep.color, context.geoKeep.wireframe);
		});
	}

	// Both functions need to be called when the radius changes
	this.geoGUI.__controllers[2].onChange(function() {
		context.graph.changeSphereGeo(context.geoKeep.radius, context.geoKeep["sphere segments"]);
		context.graph.updateTubeShape(context.geoKeep.radius, context.geoKeep["tube segments"]);
	});

	// Individual calls for the sphere segments
	this.geoGUI.__controllers[3].onChange(function() {
		context.graph.changeSphereGeo(context.geoKeep.radius, context.geoKeep["sphere segments"]);
	});

	// And another individual call for the tube segments.
	this.geoGUI.__controllers[4].onChange(function() {
		context.graph.updateTubeShape(context.geoKeep.radius, context.geoKeep["tube segments"]);
	});

	document.getElementById("geometry-gui").appendChild(this.geoGUI.domElement);
}

UI.prototype.initPoints = function() {
	this.pointsKeep = new this.Keep({
		x1: 0.1,
		y1: 0.1,
		z1: 0.1,
		w1: 0.1,
		x2: 0.1,
		y2: 0.1,
		z2: 0.1,
		w2: 0.1,
	});

	this.pointsGUI_1 = new dat.GUI();
	this.pointsGUI_2 = new dat.GUI();

	this.pointsGUI_1.add(this.pointsKeep, "x1");
	this.pointsGUI_1.add(this.pointsKeep, "y1");
	this.pointsGUI_1.add(this.pointsKeep, "z1");
	this.pointsGUI_1.add(this.pointsKeep, "w1");

	this.pointsGUI_2.add(this.pointsKeep, "x2");
	this.pointsGUI_2.add(this.pointsKeep, "y2");
	this.pointsGUI_2.add(this.pointsKeep, "z2");
	this.pointsGUI_2.add(this.pointsKeep, "w2");

	Object.keys(this.pointsKeep).forEach(function(key) {
		this.pointsKeep[key] = 0;
	}, this);

	document.getElementById("points-gui1").appendChild(this.pointsGUI_1.domElement);
	document.getElementById("points-gui2").appendChild(this.pointsGUI_2.domElement);

	for (var i = 0; i < 2; i++){
		for (var j = 0; j < 4; j++){
			[this.pointsGUI_1, this.pointsGUI_2][i].__controllers[j].updateDisplay();
		}
	}

	// A little weird. Just need to access the "this" of the current containing object inside these functions.
	var context = this;

	$("#plot-button").click(function() {
		var v1 = new THREE.Vector4(
			context.pointsKeep.x1,
			context.pointsKeep.y1,
			context.pointsKeep.z1,
			context.pointsKeep.w1
		);

		var v2 = new THREE.Vector4(
			context.pointsKeep.x2,
			context.pointsKeep.y2,
			context.pointsKeep.z2,
			context.pointsKeep.w2
		)
		context.data.addLine(v1, v2);
		context.displayLine(v1, v2);
	});

	$("#edit-points-button").click(function() {
		context.displayPoints();
	});

	$("#points-edit button").click(function() {
		context.returnToSettings();
	});
}

// Reset all the lines and the "edit current lines" div
UI.prototype.reset = function(lines) {
	this.initializePointDisplay(lines);

	for (var i = 0; i < 3; i++){
		Object.keys([this.pointsKeep, this.manualKeep, this.animationKeep][i]).forEach(function(key) {
			this[key] = 0.0;
		}, [this.pointsKeep, this.manualKeep, this.animationKeep][i])
	}

	this.geoKeep.color = [237, 87, 73];
	this.geoKeep.wireframe = false;
	this.geoKeep.radius = 0.04;
	this.geoKeep["sphere segments"] = 8;
	this.geoKeep["tube segments"] = 20;

	for (var i = 0; i < 2; i++){
		for (var j = 0; j < [this.pointsGUI_1, this.pointsGUI_2][i].__controllers.length; j++) {
			[this.pointsGUI_1, this.pointsGUI_2][i].__controllers[j].updateDisplay();
		}
	}
}

// Go to the "edit current lines" div
UI.prototype.displayPoints = function() {
	$(".gui-container").css("display", "none");
	$("#points-edit").css("display", "block")
}

// Leave the "edit current lines" div and go back to the settings div
UI.prototype.returnToSettings = function() {
	$(".gui-container").css("display", "block")
	$("#points-edit").css("display", "none");
}

// Adds a line to the point display, with a binding to delete itself.
UI.prototype.displayLine = function(v1, v2) {
	var div = document.createElement("div");
	var left = document.createElement("p");
	var right = document.createElement("p");

	left.className = "point-left";
	right.className = "point-right";
	div.className = "point-row";

	$(left).text(UI.vectorToString(v1));
	$(right).text(UI.vectorToString(v2));

	$(div).append(left);
	$(div).append(right);

	var context = this;

	$(div).click(function() {
		context.removePointDisplay(this);
	});

	$("#points-edit-containers").append(div);
}

// Remove a pointdisplay from the "edit current lines" div
UI.prototype.removePointDisplay = function(div) {
	var index = $("#points-edit-containers div").index(div);
	div.remove();
	this.data.removeLine(index);
}

UI.vectorToString = function(v) {
	return ("<" + v.x + ", " + v.y + ", " + v.z + ", " + v.w + ">");
}

// initialize the "edit current lines" div with all the current lines
UI.prototype.initializePointDisplay = function(lines) {
	$("#points-edit-containers").empty();
	for (var i = 0; i < lines.length; i++) {
		this.displayLine(lines[i][0], lines[i][1]);
	}
}
