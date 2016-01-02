var Graph = new Object();


/*
Combines all the rotations currently stored in this.rotations to produce a new current_rotation.
The stored rotations are given values by the interface, so it can update quickly and do
multiple sliders at once.
*/
Graph.produceCurrentRotation = function() {
	this.current_rotation.identity();

	if (!$.isEmptyObject(this.rotations)){
		var keys = ["xy", "yz", "zx", "xw", "wy", "wz"];

		for (var i in keys){
			if (Graph.rotations[keys[i]]){
				this.current_rotation.multiply(Graph.rotations[keys[i]]);
			}
		}
	}
}

// The initial set of lines that will be used to build the real array of vector lines
// and the array of vector points. Never used again.
Graph.array_lines = [
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

// for (var i in Graph.array_lines){
// 	for (var j in Graph.array_lines[i][0]){
// 		Graph.array_lines[i][0][j] *= 0.2;
// 		Graph.array_lines[i][1][j] *= 0.2;
// 	}
// }

// This is where the graphed meshes will be stored to be updated in animate().
Graph.meshes = [];

/*
Converts an array of lines in array format, like the one above, into an array of lines in vector format.
CREATES vectors, doesn't ALIAS them.
*/
Graph.arrayToVectors = function(lines) {
	var vector_array = [];

	for (var index in lines){
		var vector1 = new THREE.Vector4(0, 0, 0, 0);
		var vector2 = new THREE.Vector4(0, 0, 0, 0);
		vector1.fromArray(lines[index][0]);
		vector2.fromArray(lines[index][1]);
		vector_array.push([vector1, vector2]);
	}

	return vector_array;
}

// Transforms every vector in an array using the given 4d matrix transformation.
Graph.transformVectors = function(points, transformation){
	for (var index in points){
		points[index].applyMatrix4(transformation);
	}
}

/*
Clone every vector in an array of vector lines into a new array. Used to clone
Graph.lines without fucking up Graph.points.
*/
Graph.copyVectorLines = function(lines){
	ret = [];
	for (var i in lines){
		ret.push([lines[i][0].clone(), lines[i][1].clone()]);
	}
	return ret;
}

/*
Takes in an array of vector lines.
It then constructs an array of vector points of all the points present in vector_lines.
It does not create new vectors, it aliases those in vector_lines.
If 2 vectors in vector_lines are equal, they are aliased together as well.
*/
Graph.aliasVectorLinesToPoints = function(vector_lines){
	var vector_points = [];
	var v1_found;
	var v2_found;

	for (var index in vector_lines){
		var v1 = vector_lines[index][0];
		var v2 = vector_lines[index][1];
		v1_found = false;
		v2_found = false;

		for (var index2 in vector_points){
			// If this vector is already in the points list, alias all equal vectors together.
			if (vector_points[index2].equals(v1)){
				vector_lines[index][0] = vector_points[index2];
				v1_found = true;
			}

			if (vector_points[index2].equals(v2)){
				vector_lines[index][1] = vector_points[index2];
				v2_found = true;
			}
		}
		// If the vector wasn't found in the points list, it must be added.
		if (!v1_found){
			vector_points.push(v1);
		}

		if (!v2_found){
			vector_points.push(v2);
		}
	}
	return vector_points;
}

Graph.calculateNewProjection = function(points){
	var max_length = points[0].length();
	// console.log(points);
	// console.log(min_length);
	for (var index in points){
		if (points[index].length() > max_length){
			max_length = points[index].length();
			// console
		}
	}
	// console.log(min_length);
	// if (min_length <= 0.2){
	// 	min_length = 1;
	// }
	return max_length;
}

/*
Uses the w-dimensions of the vectors in points to scale down their x, y, and z-dimensions.
It copies those dimensions into the vectors in perspective_points without changing the vectors in points.
WWRRROOOONNNG
*/
Graph.perspectify = function (points, perspective_points, plane){
	// var cop = 2;
	// var plane = 1;
	// // var min_w = points[0].w;
	// // var vector_w = 0;
	var coord_array;
	var x; var y; var z; var w;
	var divisor;
	// //
	// // Find the lowest w-value.
	// for (var index in points){
	// 	vector_w = points[index].w;
	//
	// 	if (vector_w < min_w){
	// 		min_w = vector_w;
	// 	}
	// }


	for (var index in points){
		coord_array = points[index].toArray();
		x = coord_array[0];
		y = coord_array[1];
		z = coord_array[2];
		w = coord_array[3];
		divisor = (2 * plane - w) / plane;
		// w = Math.abs(coord_array[3]) + 1;
		// divisor = w + w_move;

		// w=points[index].w; //uncertain
		// console.log(plane);

		// To project onto the space w = 1, x, y, and z are divided by the w-value of the moved points.
		// perspective_points[index].set(x/divisor, y/divisor, z/divisor, 1);
		perspective_points[index].set(x/divisor, y/divisor, z/divisor, plane); //uncertain
		// console.log(perspective_points[index]);
	}
}

/*
Changes the vectors in points so that the origin is at their center,
judging by the most extreme x, y, z, and w-values.
Only needs to be used once.
*/
Graph.center = function (points){
	var x_min = points[0].x;
	var x_max = x_min;
	var y_min = points[0].y;
	var y_max = y_min;
	var z_min = points[0].z;
	var z_max = z_min;
	var w_min = points[0].w;
	var w_max = w_min;

	var x; var y; var z; var w;
	var coord_array;

	for (var index in points){
		coord_array = points[index].toArray();
		x = coord_array[0];
		y = coord_array[1];
		z = coord_array[2];
		w = coord_array[3];

		if (x < x_min){ x_min = x; }
		if (x > x_max){ x_max = x; }
		if (y < y_min){ y_min = y; }
		if (y > y_max){ y_max = y; }
		if (z < z_min){ z_min = z; }
		if (z > z_max){ z_max = z; }
		if (w < w_min){ w_min = w; }
		if (w > w_max){ w_max = w; }
	}
	var x_avg = (x_min + x_max) / 2;
	var y_avg = (y_min + y_max) / 2;
	var z_avg = (z_min + z_max) / 2;
	var w_avg = (w_min + w_max) / 2;

	for (var index in points){
		points[index].setX(points[index].x - x_avg);
		points[index].setY(points[index].y - y_avg);
		points[index].setZ(points[index].z - z_avg);
		points[index].setW(points[index].w - w_avg);
	}
}

/*
Initialize the starting parameters of the graph, and certain document elements.
*/
Graph.init = function(  options,				// parameters for the display of the graph
                        starting_rotate_distance,	// rotation distance for the first rotation matrices
                        camera_coordinates,		// where the camera starts in the scene
                        camera_args,			// fov, aspect ratio, near and far fields
                        min_zoom, max_zoom){	// how far the camera can zoom.

	this.rotations = {xw: Matrix.rs.xw(starting_rotate_distance)};
	this.initLines();

	this.animate_count = 0;
	this.camera_coordinates = camera_coordinates;

    this.options = options;
	this.initial_options = options;

	// The rotation that the animate() function will use on the graph. xw is the most impressive.
	// this.current_rotation = this.rotations.xw;
	this.current_rotation = Matrix.rs.xw(starting_rotate_distance);

	// Rendering and animation must be started by onload.js.
	this.rendering = false;
    this.animating = false;

    this.camera = new THREE.PerspectiveCamera(camera_args.fov, camera_args.aspect_ratio, camera_args.near, camera_args.far);
    this.camera.position.set(camera_coordinates[0], camera_coordinates[1], camera_coordinates[2]);

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setPixelRatio( window.devicePixelRatio );

	// Place the canvas within the document
    document.getElementById('graph-container').appendChild(this.renderer.domElement);

	// Size the canvas properly
    this.fitNewSize();

	// Controls allow the graph to respond to mouse input
    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
	this.controls.minDistance = min_zoom;
	this.controls.maxDistance = max_zoom;
    this.controls.noZoom = false;
    this.controls.noPan = true;

	// For shading
    this.light = new THREE.PointLight(0xffffff);
	this.scene.add(this.light);

	// var test = new THREE.Mesh(
	// 			new THREE.SphereGeometry(0.1, 8, 8),
	// 			new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: false})		// We need Phong because Lambert won't do flat shading.
	// 	)
	// test.position.set(0, 0, 0);
	// this.scene.add(test);
}

/*
When the size of the graph's containers change in any way, the graph
must change to fit properly.
Usually will happen when window is resized.
*/
Graph.fitNewSize = function() {
    Graph.renderer.setSize(window.innerWidth, window.innerHeight);
    Graph.camera.aspect = window.innerWidth / window.innerHeight;
    Graph.camera.updateProjectionMatrix();
}

/*
A loop that continually draws and renders the image.
Can't have any uses of "this" because it will not be used in the context of Graph
when called in requestAnimationFrame.

Should be independent of the changing of the graph, this is just the drawing of it.
*/
Graph.renderLoop = function() {
	// Only animate if there is something to animate on
	// console.log("RENDERLOOP ", Graph.animating, " ", Graph.rendering);
	// console.log(Graph.lines);
	if (!$.isEmptyObject(Graph.lines)){
		if (Graph.animating){
			if (Graph.animate_count % Graph.options.animate_wait == 0){
				Graph.animate();
				Graph.animate_count = 0;
			}
			Graph.animate_count++;
		}
	}

    if (Graph.rendering){
        requestAnimationFrame(Graph.renderLoop);
        Graph.render();
    }
}

//test

/*
Contains everything that should happen in one single drawing of the image.
The image is updated, the controls are updated, and the light is moved to the correct position.
*/
Graph.render = function() {
    this.controls.update();
    this.light.position.copy(this.camera.position);
    this.renderer.render(this.scene, this.camera);
}

/*
Completes one animation cycle of the graph.
It transforms the current points andl lines according to the current rotation, then perspectifies them,
and updates the curret meshes accordingly.
*/
Graph.animate = function() {
	this.transformVectors(this.points, this.current_rotation);
	// this.center(this.points);
	this.perspectify(this.points, this.perspective_points, this.plane);
	this.updateMeshes(this.perspective_points, this.perspective_lines);
}

/*
Animating without rendering doesn't make any sense. Therefore, you can start
the render cycle, or start the render and animate cycles, or stop the animate cycle, but you cannot stop
the render cycle without also stopping the animate cycle.
*/
Graph.startRender = function() {
	this.rendering = true;
	this.renderLoop();
}

Graph.startRenderAndAnimate = function() {
	this.animating = true;
	if (!this.rendering){
		this.rendering = true;
		this.renderLoop();
	}
}

Graph.stopAnimate = function() {
	this.animating = false;
}

Graph.stopRenderAndAnimate = function() {
	this.animating = false;
	this.rendering = false;
}

/*
It then goes through every mesh. If the mesh is a sphere, it just updates its position.
If it is an extrusion, it is given a new geometry with the transformed perspective line.
*/
Graph.updateMeshes = function (points, lines) {
	var points_index = 0;
	var lines_index = 0;

	for (var index in this.meshes){
		if (this.meshes[index].isASphere){
			this.meshes[index].position.copy(points[points_index]);
			points_index++;
		}

		else {
			// Can't just assign the new geometry, that keeps a reference to the original somewhere,
			// causing a memory leak.
			this.meshes[index].geometry.dispose();

			this.meshes[index].geometry = new THREE.ExtrudeGeometry(
				new THREE.Shape(
					(new THREE.CircleGeometry(this.options.radius, this.options.extrude_segments)).vertices.slice(1, this.options.extrude_segments + 1)
				),
				{extrudePath: new THREE.LineCurve3(
					lines[lines_index][0].clone(),
					lines[lines_index][1].clone())}
			);

			lines_index++;
		}
	}
}

/*
Add the lines described in vector_lines to the graph, and store them for future transformations.
options is of the form {color: ?, shape_segments: ?, sphere_segments: ?, radius: ?}
Just to be careful, plot should be cloning vectors, not aliasing them into the geometries.
*/
Graph.plot = function(lines, points){
	for (var index in lines){
		// This ungodly mess is to avoid memory leaks at all costs.
		var mesh = new THREE.Mesh(
			new THREE.ExtrudeGeometry(
				new THREE.Shape(
					(new THREE.CircleGeometry(this.options.radius, this.options.extrude_segments)).vertices.slice(1, this.options.extrude_segments + 1)
				),
				{extrudePath: new THREE.LineCurve3(lines[index][0].clone(), lines[index][1].clone())}
			),
			new THREE.MeshLambertMaterial({color: this.options.color, wireframe: this.options.wireframe})
		);

		mesh.isASphere = false;						// Tag tells animate it should do more than change position.
		mesh.geometry.verticesNeedUpdate = false;	// Saves memory, and the entire geometry will be remade, so no vertices need to change.
		mesh.frustumCulled = false;					// Don't let the camera destroy the whole mesh when it gets too close.

		this.scene.add(mesh);
		this.meshes.push(mesh);
	}

	for (var index in points){
		var sphere_mesh = new THREE.Mesh(
			new THREE.SphereGeometry(this.options.radius, this.options.sphere_segments, this.options.sphere_segments),
			new THREE.MeshLambertMaterial({color: this.options.color, wireframe: this.options.wireframe})		// We need Phong because Lambert won't do flat shading.
		)
		sphere_mesh.isASphere = true;
		sphere_mesh.position.set(points[index].x, points[index].y, points[index].z)		// Have to set the actual position with spheres.
		sphere_mesh.geometry.verticesNeedUpdate = false;
		sphere_mesh.frustumCulled = false;
		// sphere_mesh.material.wireframe = true;

		this.scene.add(sphere_mesh);
		this.meshes.push(sphere_mesh);
	}
}

/*
Create the starting lines and points for the graph from array_lines and perspectify them.
*/
Graph.initLines = function() {
	/*
	Slight problem that must be watched carefully:
		points and perspective_points must be absolutely parallel.
		Have to make sure that perspectify is safe, and that it is the only thing that operates
		on perspective_points.
	*/

	// Creates the 4cube vector lines and points, aliased together, and centered on the origin.
	this.lines = this.arrayToVectors(this.array_lines);
	this.points = this.aliasVectorLinesToPoints(this.lines);
	this.center(this.points);

	this.plane = this.calculateNewProjection(this.points);
	// this.lines[0] = [new THREE.Vector4(1, 0, 0, 0), new THREE.Vector4(0, 0, 0, 0)];

	// Does the same thing as above, but then perspectifies them. These are the points that will actually
	// be used in graphing.
	this.perspective_lines = this.copyVectorLines(this.lines);
	this.perspective_points = this.aliasVectorLinesToPoints(this.perspective_lines);
	this.perspectify(this.points, this.perspective_points, this.plane);
	// console.log(this.perspective_points);
}

Graph.reset = function() {
	// this.stopRenderAndAnimate();
	this.clearMeshes();
	// console.log(this.meshes);
	this.clearPointsAndLines();
	// console.log(this.points, this.lines, this.perspective_points, this.perspective_lines);
	this.current_rotation.identity();
	this.rotations = {};
	this.options = this.initial_options;
	Settings.resetGUI();
	// this.camera.position.set(this.camera_coordinates[0], this.camera_coordinates[1], this.camera_coordinates[2]);
	this.initLines();
	// console.log(this.perspective_lines);
	// console.log(this.meshes);
	this.plot(this.perspective_lines, this.perspective_points);
	console.log("TESTING");
	// console.log(this.meshes);
	// console.log(this.meshes);
	// this.animate();
	// this.render();
	// this.startRenderAndAnimate();
}

Graph.clearMeshes = function() {
	for (var index in this.meshes){
		this.scene.remove(this.meshes[index]);
		this.meshes[index].geometry.dispose();
		this.meshes[index].material.dispose();
		this.meshes[index] = null;
	}
	this.meshes = [];
}

Graph.clearPointsAndLines = function() {
	for (var index in this.points){
		this.points[index] = null;
		this.perspective_points[index] = null;
	}

	this.points = [];
	this.lines = [];
	this.perspective_points = [];
	this.perspective_lines = [];
}
