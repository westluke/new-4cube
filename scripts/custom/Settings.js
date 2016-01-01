var Settings = new Object();

Settings.init = function() {
	var Keep = function() {
		this.xy = 0.1;
		this.yz = 0.1;
		this.zx = 0.1;
		this.xw = 0.1;
		this.wy = 0.1;
		this.wz = 3;
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

	for (var i in gui.__controllers){
		gui.__controllers[i].onChange(function() {
			this.updateDisplay();
		});
		gui.__controllers[i].updateDisplay();
	}

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

	// console.log(gui2.__controllers[0]);

	animate_gui.__controllers[6].onChange(function() {
		Graph.options.animate_wait = Settings.animate_keep["skipped renders"] + 1;
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

	geo_gui.addColor(this.geo_keep, "color");
	geo_gui.add(this.geo_keep, "wireframe");
	geo_gui.add(this.geo_keep, "radius");
	geo_gui.add(this.geo_keep, "sphere segments");
	geo_gui.add(this.geo_keep, "tube segments");

	for (var i in geo_gui.__controllers){
		geo_gui.__controllers[i].onChange(function() {
			Graph.clearMeshesOnly();

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
		Settings.displayLines(Graph.lines);

	});

	this.guis = [gui, animate_gui, geo_gui, points_gui1, points_gui2];

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
	var theta = Settings.keep2[key];
	Graph.rotations[key] = Matrix.rs[key](theta/(60));
	Graph.produceCurrentRotation();
}

Settings.changeAnimateRotationFromKeyValue = function(key, value) {
	Graph.rotations[key] = Matrix.rs[key](value/(60));
	Graph.produceCurrentRotation();
}



Settings.updateAllDisplays = function() {
	for (var i in Settings.guis){
		for (var j in Settings.guis[i].__controllers){
			Settings.guis[i].__controllers[j].updateDisplay();
		}
	}
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
		$("#points-left").append("<p>" + this.vectorToString(lines[i][0]) + "</p>");
		$("#points-right").append("<p>" + this.vectorToString(lines[i][1]) + "</p>");
		$("#points-delete-buttons").append("<button onclick='Settings.removeFromList(" + i + ")'>Remove</button>")

		// var entry = "<p class='points-display' num=" + i + ">(" + lines[i][0].x + ", " + lines[i][0].y + ", " + lines[i][0].z + ", " + lines[i][0].w + ")" +
		// " - (" + lines[i][1].x + ", " + lines[i][1].y + ", " + lines[i][1].z + ", " + lines[i][1].w + ")</p>";
		// $("#points-displays").append(entry);
		console.log(this.vectorToString(lines[i][0]));
	}
}

Settings.vectorToString = function(v){
	return "(" + this.round(v.x, 2) + ", " + this.round(v.y, 2) + ", " + this.round(v.z, 2) + ", " + this.round(v.w, 2) + ")";
}

Settings.round = function (num, det){
	return Math.round(num * Math.pow(10, det) + 1/Math.pow(10, det + 1)) / Math.pow(10, det);
}

Settings.removeFromList(index);
