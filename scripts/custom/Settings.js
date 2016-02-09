var Settings = new Object();

Settings.init = function() {
	var ManualKeep = function() {
		this.xy = 0.1;
		this.yz = 0.1;
		this.zx = 0.1;
		this.xw = 0.1;
		this.wy = 0.1;
		this.wz = 0.1;
	}

	this.manual_keep = new ManualKeep();
	manual_gui = new dat.GUI();

	manual_gui.add(this.manual_keep, "xy", -6.28, 6.28);
	manual_gui.add(this.manual_keep, "yz", -6.28, 6.28);
	manual_gui.add(this.manual_keep, "zx", -6.28, 6.28);
	manual_gui.add(this.manual_keep, "xw", -6.28, 6.28);
	manual_gui.add(this.manual_keep, "wy", -6.28, 6.28);
	manual_gui.add(this.manual_keep, "wz", -6.28, 6.28);

	this.manual_keep.xy = this.manual_keep.yz = this.manual_keep.zx = this.manual_keep.xw = this.manual_keep.wy = this.manual_keep.wz = 0.0;

	document.getElementById("manual-gui").appendChild(manual_gui.domElement);
	$("#manual-control .cr").prepend("<button class='apply-button' onclick='Settings.manualRotate($(this))'>Apply</button> ");

	var AnimateKeep = function() {
		this.xy = 0.1;
		this.yz = 0.1;
		this.zx = 0.1;
		this.xw = Graph.starting_rotate_distance * 60;
		this.wy = 0.1;
		this.wz = 0.1;
		this["skipped renders"] = 0;
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
	});

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

	geo_gui.addColor(this.geo_keep, "color").listen();
	geo_gui.add(this.geo_keep, "wireframe");
	geo_gui.add(this.geo_keep, "radius", 0.001, 1);
	geo_gui.add(this.geo_keep, "tube segments", 3, 40);
	geo_gui.add(this.geo_keep, "sphere segments", 3, 10);

	for (var i = 0; i < 5; i++){
		geo_gui.__controllers[i].onChange(function(){
			Graph.options.color = Settings.geo_keep.color;
			Graph.options.wireframe = Settings.geo_keep.wireframe;
			Graph.options.radius = Settings.geo_keep.radius;
			Graph.options.extrude_segments = Settings.geo_keep["tube segments"];
			Graph.options.sphere_segments = Settings.geo_keep["sphere segments"];

			for (var index in Graph.meshes){
				Graph.meshes[index].material.dispose();
				Graph.meshes[index].material = new THREE.MeshLambertMaterial(
					{color: new THREE.Color(Graph.options.color[0]/255,
											Graph.options.color[1]/255,
											Graph.options.color[2]/255),
											wireframe: Graph.options.wireframe});
			}
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

		for (var index in Graph.circles){
			Graph.circles[index].dispose();
			Graph.shapes[index] = null;
			Graph.curves[index] = null;
		}

		Graph.plane = Graph.calculateNewProjection(Graph.points);
		// console.log(Graph.plane);
		Graph.perspective_lines = Graph.copyVectorLines(Graph.lines);
		Graph.perspective_points = Graph.aliasVectorLinesToPoints(Graph.perspective_lines);
		Graph.perspectify(Graph.points, Graph.perspective_points, Graph.plane)
		Graph.plot(Graph.perspective_lines, Graph.perspective_points);
		Settings.displayLines(Graph.lines);
	});

	$("#clear-button").click(function() {
		Graph.clearMeshes();
		Graph.clearPointsAndLines();

		for (var index in Graph.circles){
			Graph.circles[index].dispose();
			Graph.shapes[index] = null;
			Graph.curves[index] = null;
		}

		$("#points-edit-containers").empty();
	});

	this.guis = [manual_gui, animate_gui, geo_gui, points_gui1, points_gui2];
	this.updateAllDisplays();

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

// obj is the html element that was clicked.
// For some reason, this destroys the __directGeometries in the mesh.geometry?
Settings.manualRotate = function(obj) {
	var key = obj.parent().find("span.property-name").text();
	var theta = this.manual_keep[key];

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

Settings.displayLines = function(lines){
	for (var i in lines){
		$("#points-edit-containers").append(
			"<div class='point-row' onclick='Settings.removeFromList(" + i + ")'> <p class='point-left'>" + this.vectorToString(lines[i][0]) + "</p>" +
			"<p class='point-right'>" + this.vectorToString(lines[i][1]) + "&nbsp;&nbsp;&nbsp;Remove</p>"
		);
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
	for (var prop in this.manual_keep){
		this.manual_keep[prop] = 0.0;
	}

	for (var prop in this.animate_keep){
		this.animate_keep[prop] = 0.0;
	}

	this.animate_keep["skipped renders"] = 0;

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
}

Settings.removeFromList = function(index) {
	// TODO can this be more efficient? can rebuild from list instead of resetting everything
	// Just take out the right points (will be null anyways, right?)
	// Actually I can't really, because ALL of the perspective_point will change, so all meshes must be destroyed, etc.

	var newlines = Graph.copyVectorLines(Graph.lines);
	Graph.clearMeshes();
	Graph.clearPointsAndLines();

	newlines.splice(index, 1);
	Graph.lines = newlines.slice();
	console.log(newlines);

	$("#points-edit-containers").empty();

	Settings.displayLines(Graph.lines);

	if (!$.isEmptyObject(Graph.lines[0])){
		Graph.points = Graph.aliasVectorLinesToPoints(Graph.lines);
		Graph.plane = Graph.calculateNewProjection(Graph.points);

		Graph.perspective_lines = Graph.copyVectorLines(Graph.lines);
		Graph.perspective_points = Graph.aliasVectorLinesToPoints(Graph.perspective_lines);
		Graph.perspectify(Graph.points, Graph.perspective_points, Graph.plane);
		Graph.plot(Graph.perspective_lines, Graph.perspective_points);
	}
}
