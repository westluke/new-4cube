$(document).ready(function() {
    var graph_options = {
		color: 0xED5749,
		wireframe: false,
		radius: 0.03,
		sphere_segments: 8,
		extrude_segments: 20,
		animate_wait: 2
	};

	// find ratio between rotate distance and animate_wait to make sure good performance always.
    var matrix_rotate_distance = 0.003;
    var camera_coordinates = [0, 0, 2];

    var camera_args = {
		fov: 60,
		aspect_ratio: 1,
		near: 0.1,
		far: 40
	};
    var min_zoom = 0.1;
    var max_zoom = 3;

    Graph.init(graph_options, matrix_rotate_distance, camera_coordinates, camera_args, min_zoom, max_zoom);
	Graph.plot(Graph.perspective_lines, Graph.perspective_points);

	Graph.startRender();
	Graph.startAnimate();

    $("#menu-icon").click(function() {
        console.log("menu icon was clicked");
        if ($("#settings").css("display") == "none") {
            $("#settings").css("display", "block");
        }
        else {
            $("#settings").css("display", "none");
        }
    });

    window.onresize = function() {
        console.log("window.onresize fired");
        Graph.fitNewSize();
    };

	$("#animate-button").click(function() {
		if (Graph.stop_animate){
			Graph.startAnimate();
			$("#animate-button h1").text("Stop animation");
		}
		else {
			Graph.stopAnimate();
			$("#animate-button h1").text("Animate");
		}
	});

	$("#reset-button").click(function() {
		$("#animate-button h1").text("Animate");
		Graph.stopAnimate();
		Graph.reset();
		Graph.plot(Graph.perspective_lines, Graph.perspective_points);
	})

	var Keep = function() {
		this.xy = 0.1;
		this.yz = 0.1;
		this.zx = 0.1;
		this.xw = 0.1;
		this.wy = 0.1;
		this.wz = 0.1;
	}

	var keep = new Keep();
	var gui = new dat.GUI();

	gui.add(keep, "xy", -6.28, 6.28).listen();
	gui.add(keep, "yz", -6.28, 6.28).listen();
	gui.add(keep, "zx", -6.28, 6.28).listen();
	gui.add(keep, "xw", -6.28, 6.28).listen();
	gui.add(keep, "wy", -6.28, 6.28).listen();
	gui.add(keep, "wz", -6.28, 6.28).listen();
	keep.xy = keep.yz = keep.zx = keep.xw = keep.wy = keep.wz = 0.0;

	document.getElementById("manual-gui").appendChild(gui.domElement);

	var AnimateKeep = function() {
		this.xy = 0.1;
		this.yz = 0.1;
		this.zx = 0.1;
		this.xw = 0.1;
		this.wy = 0.1;
		this.wz = 0.1;
		this["skipped renders"] = 1;
		this["rotation"] = 0.003;
	}

	var keep2 = new AnimateKeep();
	var gui2 = new dat.GUI();

	gui2.add(keep2, "xy", -6.28, 6.28).listen();
	gui2.add(keep2, "yz", -6.28, 6.28).listen();
	gui2.add(keep2, "zx", -6.28, 6.28).listen();
	gui2.add(keep2, "xw", -6.28, 6.28).listen();
	gui2.add(keep2, "wy", -6.28, 6.28).listen();
	gui2.add(keep2, "wz", -6.28, 6.28).listen();
	gui2.add(keep2, "skipped renders");
	gui2.add(keep2, "rotation", -2, 2);
	keep2.xy = keep2.yz = keep2.zx = keep2.xw = keep2.wy = keep2.wz = 0.0;

	document.getElementById("animation-gui").appendChild(gui2.domElement);

	var GeometryKeep = function() {
		this.color = [237, 87, 73];
		this.wireframe = false;
		this.vertices = 8;
		this.radius = 0.03;
		this["sphere segments"] = 8;
		this["tube segments"] = 20;
	}

	var geo_keep = new GeometryKeep();
	var geo_gui = new dat.GUI();

	geo_gui.addColor(geo_keep, "color");
	geo_gui.add(geo_keep, "wireframe");
	geo_gui.add(geo_keep, "vertices");
	geo_gui.add(geo_keep, "radius");
	geo_gui.add(geo_keep, "sphere segments");
	geo_gui.add(geo_keep, "tube segments");

	document.getElementById("geometry-gui").appendChild(geo_gui.domElement);

	$("#manual-control .cr").prepend("<button class='apply-button'>Apply</button> ");

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


	var points_keep = new PointsKeep();
	var points_gui1 = new dat.GUI();
	var points_gui2 = new dat.GUI();

	points_gui1.add(points_keep, "x1");
	points_gui1.add(points_keep, "y1");
	points_gui1.add(points_keep, "z1");
	points_gui1.add(points_keep, "w1");

	points_gui2.add(points_keep, "x2");
	points_gui2.add(points_keep, "y2");
	points_gui2.add(points_keep, "z2");
	points_gui2.add(points_keep, "w2");
	document.getElementById("points-gui1").appendChild(points_gui1.domElement);
	document.getElementById("points-gui2").appendChild(points_gui2.domElement);


});
