$(document).ready(function() {
    var graph_options = {
		color: 15554377,
		// color: 0xED5749,
		// color: Settings.rgbToHex([1, 1, 1]),
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
	Settings.displayLines(Graph.lines);
	Graph.plot(Graph.perspective_lines, Graph.perspective_points);

	Graph.startRender();
	Graph.startAnimate();

    $("#menu-icon").click(function() {
        console.log("menu icon was clicked");
        if ($("#settings-wrapper").css("display") == "none") {
            $("#settings-wrapper").css("display", "block");
        }
        else {
            $("#settings-wrapper").css("display", "none");
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

	Settings.init();
});
