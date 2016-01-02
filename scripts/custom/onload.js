$(document).ready(function() {
	// console.log(Matrix.rs.xw(3.14));
    graph_options = {
		color: 15554377,
		wireframe: false,
		radius: 0.03,
		sphere_segments: 8,		// How many segments in the corner spheres
		extrude_segments: 20,	// How many vertices on the extrusions shape
		animate_wait: 1			// How many frames to skip (+1) before animating
	};

    var starting_rotate_distance = 0.006;
    var camera_coordinates = [0, 0, 2];

    var camera_args = {
		fov: 60,
		aspect_ratio: 1,
		near: 0.1,
		far: 40
	};
    var min_zoom = 0.1;
    var max_zoom = 3;

    Graph.init(graph_options, starting_rotate_distance, camera_coordinates, camera_args, min_zoom, max_zoom);
	Settings.displayLines(Graph.lines);
	Graph.plot(Graph.perspective_lines, Graph.perspective_points);
	// console.log(Graph.meshes);

	// console.log("ONLOAD " , Graph.animating, " ", Graph.rendering);
	Graph.startRenderAndAnimate();
	// Graph.startRender();
	// console.log("ONLOAD TWO" , Graph.animating, " ", Graph.rendering);

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
		if (!Graph.animating){
			Graph.startRenderAndAnimate();
			$("#animate-button h1").text("Stop animation");
		}

		else {
			Graph.stopAnimate();
			$("#animate-button h1").text("Animate");
		}
	});

	$("#reset-button").click(function() {
		// $("#animate-button h1").text("Animate");
		Graph.reset();
	})

	Settings.init();
});
