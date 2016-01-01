var Settings = new Object();

Settings.init = function() {
	var Keep = function() {
		this.xy = 0.1;
		this.yz = 0.1;
		this.zx = 0.1;
		this.xw = 0.1;
		this.wy = 0.1;
		this.wz = 0.1;
	}

	this.keep = new Keep();
	gui = new dat.GUI();

	gui.add(this.keep, "xy", -6.28, 6.28);
	gui.add(this.keep, "yz", -6.28, 6.28);
	gui.add(this.keep, "zx", -6.28, 6.28);
	gui.add(this.keep, "xw", -6.28, 6.28);
	gui.add(this.keep, "wy", -6.28, 6.28);
	gui.add(this.keep, "wz", -6.28, 6.28);

	this.keep.xy = this.keep.yz = this.keep.zx = this.keep.xw = this.keep.wy = this.keep.wz = 0.0;

	// this.fixDisplay(gui);

	document.getElementById("manual-gui").appendChild(gui.domElement);
	$("#manual-control .cr").prepend("<button class='apply-button' onclick='Settings.manualRotate($(this))'>Apply</button> ");

	var AnimateKeep = function() {
		this.xy = 0.1;
		this.yz = 0.1;
		this.zx = 0.1;
		this.xw = 0.003 * 60;
		this.wy = 0.1;
		this.wz = 0.1;
		this["skipped renders"] = 1;
	}

	this.animate_keep = new AnimateKeep();
	var animate_gui = new dat.GUI();

	animate_gui.add(this.animate_keep, "xy", -6.28, 6.28);
	animate_gui.add(this.animate_keep, "yz", -6.28, 6.28);
	animate_gui.add(this.animate_keep, "zx", -6.28, 6.28);
	animate_gui.add(this.animate_keep, "xw", -6.28, 6.28);
	animate_gui.add(this.animate_keep, "wy", -6.28, 6.28);
	animate_gui.add(this.animate_keep, "wz", -6.28, 6.28);
	animate_gui.add(this.animate_keep, "skipped renders");

	this.animate_keep.xy = this.animate_keep.yz = this.animate_keep.zx = this.animate_keep.wy = this.animate_keep.wz = 0.0;

	for (var i in animate_gui.__controllers){
		animate_gui.__controllers[i].onChange(function() {
			this.updateDisplay();
			Settings.changeAnimateRotationFromKeyValue(this.property, Settings.animate_keep[this.property]);
		});
		animate_gui.__controllers[i].updateDisplay();
	}

	animate_gui.__controllers[6].onChange(function() {
		Graph.options.animate_wait = Settings.animate_keep["skipped renders"] + 1;
		this.updateDisplay();
		// console.log("hello fuck");
		// console.log(Graph.options.animate_wait);
	});
	//
	// this.animate_keep["skipped renders"] = 18;
	// animate_gui.__controllers[6].updateDisplay();

	document.getElementById("animation-gui").appendChild(animate_gui.domElement);

	var GeometryKeep = function() {
		this.color = [237, 87, 73];
		this.wireframe = false;
		this.radius = 0.03;
		this["sphere segments"] = 8;
		this["tube segments"] = 20;
	}

	this.geo_keep = new GeometryKeep();
	var geo_gui = new dat.GUI();

	geo_gui.addColor(this.geo_keep, "color");
	geo_gui.add(this.geo_keep, "wireframe");
	geo_gui.add(this.geo_keep, "radius");
	geo_gui.add(this.geo_keep, "sphere segments");
	geo_gui.add(this.geo_keep, "tube segments");

	for (var i in geo_gui.__controllers){
		geo_gui.__controllers[i].onChange(function() {
			Graph.clearMeshes();

			Graph.options = {
				color: parseInt("0x0" + Settings.rgbToHex(Settings.geo_keep.color).slice(1)),
				wireframe: Settings.geo_keep.wireframe,
				radius: Settings.geo_keep.radius,
				sphere_segments: Settings.geo_keep["sphere segments"],
				extrude_segments: Settings.geo_keep["tube segments"],
				animate_wait: 2
			}

			Graph.plot(Graph.lines, Graph.points);
		});
	}

	document.getElementById("geometry-gui").appendChild(geo_gui.domElement);

	var PointsKeep = function (){
		this.x1 = 0.0;
		this.y1 = 0.0;
		this.z1 = 0.0;
		this.w1 = 0.0;
		this.x2 = 0.0;
		this.y2 = 0.0;
		this.z2 = 0.0;
		this.w2 = 0.0;
	}

	this.points_keep = new PointsKeep();
	var points_gui1 = new dat.GUI();
	var points_gui2 = new dat.GUI();

	points_gui1.add(this.points_keep, "x1");
	points_gui1.add(this.points_keep, "y1");
	points_gui1.add(this.points_keep, "z1");
	points_gui1.add(this.points_keep, "w1");

	points_gui2.add(this.points_keep, "x2");
	points_gui2.add(this.points_keep, "y2");
	points_gui2.add(this.points_keep, "z2");
	points_gui2.add(this.points_keep, "w2");

	document.getElementById("points-gui1").appendChild(points_gui1.domElement);
	document.getElementById("points-gui2").appendChild(points_gui2.domElement);

	$(".gui-container input").blur(function(event) {
		if (!event.target.value){
			$(event.target).val("0");
		}
	});

	$("#plot-button").click(function() {
		var v1 = new THREE.Vector4(Settings.points_keep.x1, Settings.points_keep.y1, Settings.points_keep.z1, Settings.points_keep.w1);
		var v2 = new THREE.Vector4(Settings.points_keep.x2, Settings.points_keep.y2, Settings.points_keep.z2, Settings.points_keep.w2);

		Graph.lines.push([v1, v2]);
		Graph.points = Graph.aliasVectorLinesToPoints(Graph.lines);
		Graph.clearMeshes();
		Graph.perspective_lines = Graph.copyVectorLines(Graph.lines);
		Graph.perspective_points = Graph.aliasVectorLinesToPoints(Graph.perspective_lines);
		Graph.perspectify(Graph.points, Graph.perspective_points)
		Graph.plot(Graph.perspective_lines, Graph.perspective_points);
		Settings.displayLines(Graph.lines);
	});

	$("#clear-button").click(function() {
		Graph.clearMeshes();
		Graph.clearPointsAndLines();
		$("#points-left, #points-right, #points-delete-buttons").empty();
	});

	this.guis = [gui, animate_gui, geo_gui, points_gui1, points_gui2];
	this.updateAllDisplays();

	// for (index in this.guis){
	// 	this.fixDisplay(this.guis[index]);
	// }
	//
	// this.animate_keep["skipped renders"] = 18;

	var sliders = $("#animation-control .slider");
	sliders.mousedown(function(event) {
		Settings.target = event.target;
	});

	$(document).mouseup(function(event) {
		if (Settings.target){
			Settings.changeAnimateRotation(Settings.target);
			Settings.target = null;
		}
	});
}

Settings.fixDisplay = function (gui){
	for (var i in gui.__controllers){
		gui.__controllers[i].onChange(function() {
			this.updateDisplay();
		});
		gui.__controllers[i].updateDisplay();
	}
}

Settings.displayPoints = function() {
	$(".gui-container").css("display", "none");
	$("#points-edit").css("display", "block")
}

Settings.returnToSettings = function() {
	$(".gui-container").css("display", "block")
	$("#points-edit").css("display", "none");
}

Settings.manualRotate = function(obj) {
	var key = obj.parent().find("span.property-name").text();
	var theta = this.keep[key];

	Graph.transformVectors(Graph.points, Matrix.rs[key](theta));
	Graph.animate();
}

Settings.changeAnimateRotation = function(obj) {
	var key = $(obj).parent().parent().parent().find("span.property-name").text();
	var theta = Settings.animate_keep[key];
	Graph.rotations[key] = Matrix.rs[key](theta/(60));
	Graph.produceCurrentRotation();
}

Settings.changeAnimateRotationFromKeyValue = function(key, value) {
	Graph.rotations[key] = Matrix.rs[key](value/(60));
	Graph.produceCurrentRotation();
}

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
Settings.rgbToHex = function(rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

Settings.displayLines = function(lines){
	for (var i in lines){
		$("#points-edit-containers").append(
			"<div class='point-row' onclick='Settings.removeFromList(" + i + ")'> <p class='point-left'>" + this.vectorToString(lines[i][0]) + "</p>" +
			"<p class='point-right'>" + this.vectorToString(lines[i][1]) + "</p>" +
			"<button onclick='Settings.removeFromList(" + i + ")'>Remove</button></div>"
		);
		// $("#points-right").append("<p>" + this.vectorToString(lines[i][1]) + "</p>");
		// $("#points-delete-buttons").append("<button onclick='Settings.removeFromList(" + i + ")'>Remove</button>")
	}
}

Settings.vectorToString = function(v){
	return "(" + this.round(v.x, 2) + ", " + this.round(v.y, 2) + ", " + this.round(v.z, 2) + ", " + this.round(v.w, 2) + ")";
}

Settings.round = function (num, det){
	return Math.round(num * Math.pow(10, det) + 1/Math.pow(10, det + 1)) / Math.pow(10, det);
}

Settings.updateAllDisplays = function() {
	for (var i in Settings.guis){
		for (var j in Settings.guis[i].__controllers){
			Settings.guis[i].__controllers[j].updateDisplay();
		}
	}
}

Settings.resetGUI = function() {
	for (var prop in this.keep){
		this.keep[prop] = 0.0;
	}
	for (var prop in this.animate_keep){
		this.animate_keep[prop] = 0.0;
	}
	this.animate_keep["skipped renders"] = 1;

	this.geo_keep.color = [237, 87, 73];
	this.geo_keep.wireframe = false;
	this.geo_keep.radius = 0.03;
	this.geo_keep["sphere_segments"] = 8;
	this.geo_keep["tube segments"] = 20;

	for (var prop in this.points_keep){
		this.points_keep[prop] = 0.0;
	}

	this.updateAllDisplays();
	this.displayLines(Graph.lines);

	console.log(Graph.options.animate_wait);
	console.log(this.animate_keep["skipped renders"]);
}

Settings.removeFromList = function(index) {
	var newlines = Graph.copyVectorLines(Graph.lines);
	Graph.clearMeshes();
	Graph.clearPointsAndLines();

	// console.log(Graph.points);
	// console.log(Graph.lines);

	// Graph.points = null; Graph.lines = null;
	newlines.splice(index, 1);
	Graph.lines = newlines.slice();
	// console.log(Graph.lines);
			// Graph.clearMeshesOnly();
	$("#points-edit-containers").empty();
	if (!$.isEmptyObject(Graph.lines[0])){
		Graph.points = Graph.aliasVectorLinesToPoints(Graph.lines);
		Graph.perspective_lines = Graph.copyVectorLines(Graph.lines);
		Graph.perspective_points = Graph.aliasVectorLinesToPoints(Graph.perspective_lines);
		Graph.perspectify(Graph.points, Graph.perspective_points);
		// console.log(Graph.points);
		// console.log(Graph.meshes);
		Graph.plot(Graph.perspective_lines, Graph.perspective_points);
		Settings.displayLines(Graph.lines);
	}
}
