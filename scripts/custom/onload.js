// At some point, I should put the binding functions at the bottom into their own functions, and connect them in the actual
// html document.

// http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
function webgl_detect(return_context)
{
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
             names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
           context = false;

        for(var i=0;i<4;i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    // WebGL is enabled
                    if (return_context) {
                        // return WebGL object if the function's argument is present
                        return {name:names[i], gl:context};
                    }
                    // else, return just true
                    return true;
                }
            } catch(e) {}
        }

        // WebGL is supported, but disabled
        return false;
    }

    // WebGL not supported
    return false;
}

$(document).ready(function() {

	if (webgl_detect()) {
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

		// Set up the graph and make the appropriate lines and points, but don't graph them yet.
	    Graph.init(graph_options, starting_rotate_distance, camera_coordinates, camera_args, min_zoom, max_zoom);

		// Graph the lines
		Graph.plot(Graph.perspective_lines, Graph.perspective_points);

		// Update the points-edit-container to display the current lines
		Settings.displayLines(Graph.lines);

		// Start animating the graph, and also start displaying changes to the graph
		Graph.render();
		Graph.startRenderAndAnimate();

		// Toggles the display of the settings menu
	    $("#menu-icon").click(function() {
	        console.log("menu icon was clicked");
	        if ($("#settings-wrapper").css("display") == "none") {
	            $("#settings-wrapper").css("display", "block");
	        }
	        else {
	            $("#settings-wrapper").css("display", "none");
	        }
	    });

		// Updates the graph to fit a new window size
	    window.onresize = function() {
	        console.log("window.onresize fired");
	        Graph.fitNewSize();
	    };

		// Toggle animation
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

		// Reset the graph
		$("#reset-button").click(function() {
			Graph.reset();
			$("#points-edit-containers").empty();
			Settings.displayLines(Graph.lines);
		})

		Settings.init();

	} else {
		// If the browser has webgl disabled, display the correct message.
		$("#nowebgl").css("display", "block")
	}

	window.onunload = function() {
		console.log("refresh");
		$("canvas").remove();
		Graph.stopRenderAndAnimate();
		Graph.reset();

		Graph.scene = null;
		Graph.renderer = null;
		Graph.light = null;
		Graph.camera = null;

		for (var index in Graph.circles){
			Graph.circles[index].dispose();
			Graph.shapes[index] = null;
			Graph.curves[index] = null;
		}

		Matrix = null;
		Graph = null;
		Settings = null;
	}
});
