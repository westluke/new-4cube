$(document).ready(function() {
    var graph_options = {color: 0xED5749, wireframe: false, radius: 0.04, vertices: 8};
    var matrix_rotate_distance = 0.01;
    var camera_coordinates = [0, 0, 2];
    var camera_args = {fov: 60, aspect_ratio: 1, near: 0.001, far: 40};
    // var camera_args = {fov: 60, aspect_ratio: 1, near: 0.001, far: 400};
    var min_zoom = 0.001;
    var max_zoom = 40;

    Graph.init(graph_options, matrix_rotate_distance, camera_coordinates, camera_args, min_zoom, max_zoom);

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

	// console.log(Graph.vector_lines);
	// Graph.vector_points = Graph.aliasVectorLinesToPoints(Graph.vector_lines);
	// console.log(Graph.vector_points);
	// Graph.vector_lines[0][0].set(20, 20, 20, 20);
	// console.log(Graph.vector_lines);
	// Graph.plot(Graph.vector_lines, {color: 0xED5749, shape_segments: 10, sphere_segments: 10, radius: 0.1});
    // Graph.startRender();
    // Graph.startAnimate();
});
