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

// preload both points and lines.

// NO this is dumb. If i'm preloading then maybe they should be set to their real values, which would mean subtracting
// 0.5 from everything. Also, I can preload lines and I can preload points, but I can't preload the aliasing between them.
// Also, I refuse to waste memory, and preloading lines with vectors definitely wastes memory.
// What I could do is preload lines, subtract vector4(0.5, 0.5, 0.5, 0.5) from all of them, keep the lines as arrays,
// use a function that tests equality between vectors and arrays, and alias them that way, which seems like maximum efficiency.
// OH OKAY so first we create vectors and alias them (doing the same thing to lines and ppoints, only with cloning)
// THEN we subtract the vector from all points.

var initLines = [
[ [0,0,0,0], [0,0,0,1] ],
[ [0,0,0,0], [0,0,1,0] ],
[ [0,0,0,0], [0,1,0,0] ],
[ [0,0,0,0], [1,0,0,0] ],
[ [0,0,0,1], [0,0,1,1] ],
[ [0,0,0,1], [0,1,0,1] ],
[ [0,0,0,1], [1,0,0,1] ],
[ [0,0,1,1], [0,0,1,0] ],
[ [0,0,1,1], [0,1,1,1] ],
[ [0,0,1,1], [1,0,1,1] ],
[ [0,0,1,0], [0,1,1,0] ],
[ [0,0,1,0], [1,0,1,0] ],
[ [0,1,1,0], [0,1,0,0] ],
[ [0,1,1,0], [0,1,1,1] ],
[ [0,1,1,0], [1,1,1,0] ],
[ [0,1,0,0], [0,1,0,1] ],
[ [0,1,0,0], [1,1,0,0] ],
[ [0,1,0,1], [0,1,1,1] ],
[ [0,1,0,1], [1,1,0,1] ],
[ [0,1,1,1], [1,1,1,1] ],
[ [1,1,1,1], [1,0,1,1] ],
[ [1,1,1,1], [1,1,1,0] ],
[ [1,1,1,1], [1,1,0,1] ],
[ [1,0,1,1], [1,0,0,1] ],
[ [1,0,1,1], [1,0,1,0] ],
[ [1,0,0,1], [1,0,0,0] ],
[ [1,0,0,1], [1,1,0,1] ],
[ [1,0,0,0], [1,0,1,0] ],
[ [1,0,0,0], [1,1,0,0] ],
[ [1,0,1,0], [1,1,1,0] ],
[ [1,1,1,0], [1,1,0,0] ],
[ [1,1,0,0], [1,1,0,1] ] ];
