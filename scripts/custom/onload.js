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
	var graph = new Graph(gl, [237, 87, 73], false, 0.04, 8, 20);

	var data = new Data(graph);
	var ui = new UI(data, graph);

	data.initializeCube(initLines);
	ui.initializePointDisplay(initLines);

	var animation = new Animation(1, 1, gl, data);
	animation.startRenderAndAnimate();


	// var v = new THREE.Vector4(0.5, 0.5, 0.5, 0.5);
	// var v1;
	// var v2;
	// var temp;
	// var ret = "";
	//
	// for (var i = 0; i < initLines.length; i++) {
	// 	v1 = initLines[i][0];
	// 	v2 = initLines[i][1]
	// 	v1.sub(v);
	// 	v2.sub(v);
	// 	ret += "[ ";
	//
	// 	for (var j = 0; j < 2; j++){
	// 		temp = [v1, v2][j];
	// 		if (j == 1){
	// 			ret += ", "
	// 		}
	// 		temp = [v1, v2][j];
	// 		ret += ("new THREE.Vector4(" + temp.x + ", " + temp.y + ", " + temp.z + ", " + temp.w + ")");
	// 	}
	//
	// 	ret += " ],\n";
	// }

	// console.log(ret);

	window.onresize = function() {
		gl.fitNewSize();
	}

	$("#animate-button").click(function() {
		if (!animation.animating){
			animation.startRenderAndAnimate();
			$("#animate-button h1").text("Stop animation");
		}

		else {
			animation.stopAnimate();
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

// var initLines = [
// [ new THREE.Vector4(0,0,0,0), new THREE.Vector4(0,0,0,1) ],
// [ new THREE.Vector4(0,0,0,0), new THREE.Vector4(0,0,1,0) ],
// [ new THREE.Vector4(0,0,0,0), new THREE.Vector4(0,1,0,0) ],
// [ new THREE.Vector4(0,0,0,0), new THREE.Vector4(1,0,0,0) ],
// [ new THREE.Vector4(0,0,0,1), new THREE.Vector4(0,0,1,1) ],
// [ new THREE.Vector4(0,0,0,1), new THREE.Vector4(0,1,0,1) ],
// [ new THREE.Vector4(0,0,0,1), new THREE.Vector4(1,0,0,1) ],
// [ new THREE.Vector4(0,0,1,1), new THREE.Vector4(0,0,1,0) ],
// [ new THREE.Vector4(0,0,1,1), new THREE.Vector4(0,1,1,1) ],
// [ new THREE.Vector4(0,0,1,1), new THREE.Vector4(1,0,1,1) ],
// [ new THREE.Vector4(0,0,1,0), new THREE.Vector4(0,1,1,0) ],
// [ new THREE.Vector4(0,0,1,0), new THREE.Vector4(1,0,1,0) ],
// [ new THREE.Vector4(0,1,1,0), new THREE.Vector4(0,1,0,0) ],
// [ new THREE.Vector4(0,1,1,0), new THREE.Vector4(0,1,1,1) ],
// [ new THREE.Vector4(0,1,1,0), new THREE.Vector4(1,1,1,0) ],
// [ new THREE.Vector4(0,1,0,0), new THREE.Vector4(0,1,0,1) ],
// [ new THREE.Vector4(0,1,0,0), new THREE.Vector4(1,1,0,0) ],
// [ new THREE.Vector4(0,1,0,1), new THREE.Vector4(0,1,1,1) ],
// [ new THREE.Vector4(0,1,0,1), new THREE.Vector4(1,1,0,1) ],
// [ new THREE.Vector4(0,1,1,1), new THREE.Vector4(1,1,1,1) ],
// [ new THREE.Vector4(1,1,1,1), new THREE.Vector4(1,0,1,1) ],
// [ new THREE.Vector4(1,1,1,1), new THREE.Vector4(1,1,1,0) ],
// [ new THREE.Vector4(1,1,1,1), new THREE.Vector4(1,1,0,1) ],
// [ new THREE.Vector4(1,0,1,1), new THREE.Vector4(1,0,0,1) ],
// [ new THREE.Vector4(1,0,1,1), new THREE.Vector4(1,0,1,0) ],
// [ new THREE.Vector4(1,0,0,1), new THREE.Vector4(1,0,0,0) ],
// [ new THREE.Vector4(1,0,0,1), new THREE.Vector4(1,1,0,1) ],
// [ new THREE.Vector4(1,0,0,0), new THREE.Vector4(1,0,1,0) ],
// [ new THREE.Vector4(1,0,0,0), new THREE.Vector4(1,1,0,0) ],
// [ new THREE.Vector4(1,0,1,0), new THREE.Vector4(1,1,1,0) ],
// [ new THREE.Vector4(1,1,1,0), new THREE.Vector4(1,1,0,0) ],
// [ new THREE.Vector4(1,1,0,0), new THREE.Vector4(1,1,0,1) ] ];

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
