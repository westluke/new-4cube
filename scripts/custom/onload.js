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

	var data = new Data();
	
	// console.log("Length" + l.getLength());
	// console.log(l.containsPoint(new THREE.Vector4(0, 0, 1, 0)));

	// l.getV1() = new THREE.Vector4(0, 1, 1, 1);
	// l.setV1(new THREE.Vector4(1, 1, 1, 1));
	// console.log(l.curve.v1);
	// console.log(l.equals(l2));




	// data.initializeCube(init_lines, init_points);

	// var gl = new GL("graph-container", [1, 1, 1], 0.1, 3, cam_args);
	// var graph
	// var animation = new Animation(1, 1, gl);
	// animation.startRender();
	//
	// var l = new Line(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1))

	// window.onresize = function() {
	// 	gl.fitNewSize();
	// }
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

var init_lines = [
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

var init_points = [
new THREE.Vector4(0, 0, 0, 0),
new THREE.Vector4(0, 0, 0, 1),
new THREE.Vector4(0, 0, 1, 0),
new THREE.Vector4(0, 1, 0, 0),
new THREE.Vector4(1, 0, 0, 0),
new THREE.Vector4(0, 0, 1, 1),
new THREE.Vector4(0, 1, 0, 1),
new THREE.Vector4(1, 0, 0, 1),
new THREE.Vector4(0, 1, 1, 0),
new THREE.Vector4(1, 0, 1, 0),
new THREE.Vector4(1, 1, 0, 0),
new THREE.Vector4(0, 1, 1, 1),
new THREE.Vector4(1, 0, 1, 1),
new THREE.Vector4(1, 1, 0, 1),
new THREE.Vector4(1, 1, 1, 0),
new THREE.Vector4(1, 1, 1, 1)
];
