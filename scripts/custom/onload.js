function print(obj){
	var x = obj;
	console.log(x);
}

$(document).ready(function() {
	if (!webgl_detect()){
		return;
	}

	var cam_args = {
		fov: 60,
		aspect_ratio: 1,
		near_plane: 0.05,
		far_plane: 10,
		x: 0,
		y: 0,
		z: 3
	}

	var gl = new GL(	"graph-container",
						[1, 1, 1],
						0.1,
						3,
						cam_args	);

	var graph = new Graph(	gl,
							[237, 87, 73],
							false,
							0.04,
							8,
							20	);

	var data = new Data(graph);
	var ui = new UI(data, graph);

	data.initializeCube(initLines);
	ui.initializePointDisplay(initLines);

	var animation = new Repeat(1, function() {
		data.transformWithCurrentMatrix();
	});

	animation.start();

	var renderCycle = new Repeat(1, function() {
		gl.render();
		gl.updateControls();
		gl.moveLightToCamera();
	});

	renderCycle.start();

	window.onresize = function() {
		gl.fitNewSize();
	}

	$("#animate-button").click(function() {
		if (!animation.running){
			animation.start();
			$("#animate-button h1").text("Stop animation");
		}

		else {
			animation.stop();
			$("#animate-button h1").text("Animate");
		}
	});

	$("#menu-icon").click(function() {
		if ($("#settings-wrapper").css("display") == "none") {
			$("#settings-wrapper").css("display", "block");
		}
		else {
			$("#settings-wrapper").css("display", "none");
		}
	});

	$("#reset-button").click(function() {
		data.initializeCube(initLines);
		data.clearTransforms();
		ui.reset(initLines);
		graph.updateMaterials([237, 87, 73], false);
		graph.updateTubeShape(0.04, 20);
		graph.changeSphereGeo(0.04, 8);
	});
});

// http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
function webgl_detect(return_context) {
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

var initLines = [
[ new THREE.Vector4(-0.5, -0.5, -0.5, -0.5), new THREE.Vector4(-0.5, -0.5, -0.5, 0.5) ],
[ new THREE.Vector4(-0.5, -0.5, -0.5, -0.5), new THREE.Vector4(-0.5, -0.5, 0.5, -0.5) ],
[ new THREE.Vector4(-0.5, -0.5, -0.5, -0.5), new THREE.Vector4(-0.5, 0.5, -0.5, -0.5) ],
[ new THREE.Vector4(-0.5, -0.5, -0.5, -0.5), new THREE.Vector4(0.5, -0.5, -0.5, -0.5) ],
[ new THREE.Vector4(-0.5, -0.5, -0.5, 0.5), new THREE.Vector4(-0.5, -0.5, 0.5, 0.5) ],
[ new THREE.Vector4(-0.5, -0.5, -0.5, 0.5), new THREE.Vector4(-0.5, 0.5, -0.5, 0.5) ],
[ new THREE.Vector4(-0.5, -0.5, -0.5, 0.5), new THREE.Vector4(0.5, -0.5, -0.5, 0.5) ],
[ new THREE.Vector4(-0.5, -0.5, 0.5, 0.5), new THREE.Vector4(-0.5, -0.5, 0.5, -0.5) ],
[ new THREE.Vector4(-0.5, -0.5, 0.5, 0.5), new THREE.Vector4(-0.5, 0.5, 0.5, 0.5) ],
[ new THREE.Vector4(-0.5, -0.5, 0.5, 0.5), new THREE.Vector4(0.5, -0.5, 0.5, 0.5) ],
[ new THREE.Vector4(-0.5, -0.5, 0.5, -0.5), new THREE.Vector4(-0.5, 0.5, 0.5, -0.5) ],
[ new THREE.Vector4(-0.5, -0.5, 0.5, -0.5), new THREE.Vector4(0.5, -0.5, 0.5, -0.5) ],
[ new THREE.Vector4(-0.5, 0.5, 0.5, -0.5), new THREE.Vector4(-0.5, 0.5, -0.5, -0.5) ],
[ new THREE.Vector4(-0.5, 0.5, 0.5, -0.5), new THREE.Vector4(-0.5, 0.5, 0.5, 0.5) ],
[ new THREE.Vector4(-0.5, 0.5, 0.5, -0.5), new THREE.Vector4(0.5, 0.5, 0.5, -0.5) ],
[ new THREE.Vector4(-0.5, 0.5, -0.5, -0.5), new THREE.Vector4(-0.5, 0.5, -0.5, 0.5) ],
[ new THREE.Vector4(-0.5, 0.5, -0.5, -0.5), new THREE.Vector4(0.5, 0.5, -0.5, -0.5) ],
[ new THREE.Vector4(-0.5, 0.5, -0.5, 0.5), new THREE.Vector4(-0.5, 0.5, 0.5, 0.5) ],
[ new THREE.Vector4(-0.5, 0.5, -0.5, 0.5), new THREE.Vector4(0.5, 0.5, -0.5, 0.5) ],
[ new THREE.Vector4(-0.5, 0.5, 0.5, 0.5), new THREE.Vector4(0.5, 0.5, 0.5, 0.5) ],
[ new THREE.Vector4(0.5, 0.5, 0.5, 0.5), new THREE.Vector4(0.5, -0.5, 0.5, 0.5) ],
[ new THREE.Vector4(0.5, 0.5, 0.5, 0.5), new THREE.Vector4(0.5, 0.5, 0.5, -0.5) ],
[ new THREE.Vector4(0.5, 0.5, 0.5, 0.5), new THREE.Vector4(0.5, 0.5, -0.5, 0.5) ],
[ new THREE.Vector4(0.5, -0.5, 0.5, 0.5), new THREE.Vector4(0.5, -0.5, -0.5, 0.5) ],
[ new THREE.Vector4(0.5, -0.5, 0.5, 0.5), new THREE.Vector4(0.5, -0.5, 0.5, -0.5) ],
[ new THREE.Vector4(0.5, -0.5, -0.5, 0.5), new THREE.Vector4(0.5, -0.5, -0.5, -0.5) ],
[ new THREE.Vector4(0.5, -0.5, -0.5, 0.5), new THREE.Vector4(0.5, 0.5, -0.5, 0.5) ],
[ new THREE.Vector4(0.5, -0.5, -0.5, -0.5), new THREE.Vector4(0.5, -0.5, 0.5, -0.5) ],
[ new THREE.Vector4(0.5, -0.5, -0.5, -0.5), new THREE.Vector4(0.5, 0.5, -0.5, -0.5) ],
[ new THREE.Vector4(0.5, -0.5, 0.5, -0.5), new THREE.Vector4(0.5, 0.5, 0.5, -0.5) ],
[ new THREE.Vector4(0.5, 0.5, 0.5, -0.5), new THREE.Vector4(0.5, 0.5, -0.5, -0.5) ],
[ new THREE.Vector4(0.5, 0.5, -0.5, -0.5), new THREE.Vector4(0.5, 0.5, -0.5, 0.5) ]];
