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

	var gl = new GL("graph-container", [1, 1, 1], 0.1, 3, cam_args);
	var graph = new Graph(gl, [0.5, 0.5, 1], false, 0.05, 10, 20);
	var data = new Data(graph);
	// data.setTransform("xy", 0.01);

	data.initializeCube(initLines);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);

	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);

	data.removeLine(0);
	data.removeLine(0);
	data.removeLine(0);

	data.removeLine(0);
	// data.removeLine(0);
	// console.log(initLines);
	var animation = new Animation(1, 1, gl, data);
	animation.startRender();

	window.onresize = function() {
		gl.fitNewSize();
	}
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
[ new THREE.Vector4(0,0,0,0), new THREE.Vector4(0,0,0,1) ],
[ new THREE.Vector4(0,0,0,0), new THREE.Vector4(0,0,1,0) ],
[ new THREE.Vector4(0,0,0,0), new THREE.Vector4(0,1,0,0) ],
[ new THREE.Vector4(0,0,0,0), new THREE.Vector4(1,0,0,0) ],
[ new THREE.Vector4(0,0,0,1), new THREE.Vector4(0,0,1,1) ],
[ new THREE.Vector4(0,0,0,1), new THREE.Vector4(0,1,0,1) ],
[ new THREE.Vector4(0,0,0,1), new THREE.Vector4(1,0,0,1) ],
[ new THREE.Vector4(0,0,1,1), new THREE.Vector4(0,0,1,0) ],
[ new THREE.Vector4(0,0,1,1), new THREE.Vector4(0,1,1,1) ],
[ new THREE.Vector4(0,0,1,1), new THREE.Vector4(1,0,1,1) ],
[ new THREE.Vector4(0,0,1,0), new THREE.Vector4(0,1,1,0) ],
[ new THREE.Vector4(0,0,1,0), new THREE.Vector4(1,0,1,0) ],
[ new THREE.Vector4(0,1,1,0), new THREE.Vector4(0,1,0,0) ],
[ new THREE.Vector4(0,1,1,0), new THREE.Vector4(0,1,1,1) ],
[ new THREE.Vector4(0,1,1,0), new THREE.Vector4(1,1,1,0) ],
[ new THREE.Vector4(0,1,0,0), new THREE.Vector4(0,1,0,1) ],
[ new THREE.Vector4(0,1,0,0), new THREE.Vector4(1,1,0,0) ],
[ new THREE.Vector4(0,1,0,1), new THREE.Vector4(0,1,1,1) ],
[ new THREE.Vector4(0,1,0,1), new THREE.Vector4(1,1,0,1) ],
[ new THREE.Vector4(0,1,1,1), new THREE.Vector4(1,1,1,1) ],
[ new THREE.Vector4(1,1,1,1), new THREE.Vector4(1,0,1,1) ],
[ new THREE.Vector4(1,1,1,1), new THREE.Vector4(1,1,1,0) ],
[ new THREE.Vector4(1,1,1,1), new THREE.Vector4(1,1,0,1) ],
[ new THREE.Vector4(1,0,1,1), new THREE.Vector4(1,0,0,1) ],
[ new THREE.Vector4(1,0,1,1), new THREE.Vector4(1,0,1,0) ],
[ new THREE.Vector4(1,0,0,1), new THREE.Vector4(1,0,0,0) ],
[ new THREE.Vector4(1,0,0,1), new THREE.Vector4(1,1,0,1) ],
[ new THREE.Vector4(1,0,0,0), new THREE.Vector4(1,0,1,0) ],
[ new THREE.Vector4(1,0,0,0), new THREE.Vector4(1,1,0,0) ],
[ new THREE.Vector4(1,0,1,0), new THREE.Vector4(1,1,1,0) ],
[ new THREE.Vector4(1,1,1,0), new THREE.Vector4(1,1,0,0) ],
[ new THREE.Vector4(1,1,0,0), new THREE.Vector4(1,1,0,1) ] ];
