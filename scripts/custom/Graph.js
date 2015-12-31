var Graph = new Object();

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

// This is where the graphed meshes will be stored to be updated in animate().
Graph.meshes = [];

/*
Converts an array of lines in array format, like the one above, into an array of lines in vector format.
CREATES vectors, doesn't ALIAS them.
*/
Graph.arrayToVectors = function(lines) {
	var vector_array = [];

	for (index in lines){
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
	for (index in points){
		points[index].applyMatrix4(transformation);
	}
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

	for (index in vector_lines){
		var v1 = vector_lines[index][0];
		var v2 = vector_lines[index][1];
		v1_found = false;
		v2_found = false;

		for (index2 in vector_points){
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

/*
Uses the w-dimensions of the vectors in points to scale down their x, y, and z-dimensions.
It copies those dimensions into the vectors in perspective_points without changing the vectors in points.
*/
Graph.perspectify = function (points, perspective_points){
	var min_w = points[0].w;
	var vector_w = 0;
	var coord_array;
	var x; var y; var z; var w;
	var divisor;

	// Find the lowest w-value.
	for (index in points){
		vector_w = points[index].w;

		if (vector_w < min_w){
			min_w = vector_w;
		}
	}

	// For this to work, we have to pretend that the point with the lowest w-value has
	// actually been moved to touch the space w = 1. This means that all the points have
	// to be moved by w_move.
	var w_move = 1 - min_w;

	for (index in points){
		coord_array = points[index].toArray();
		x = coord_array[0];
		y = coord_array[1];
		z = coord_array[2];
		w = coord_array[3];
		divisor = w + w_move;

		// To project onto the space w = 1, x, y, and z are divided by the w-value of the moved points.
		perspective_points[index].set(x/divisor, y/divisor, z/divisor, 1);
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

	for (index in points){
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

	for (index in points){
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
                        matrix_rotate_distance,	// rotation distance for the base rotation matrices
                        camera_coordinates,		// where the camera starts in the scene
                        camera_args,			// fov, aspect ratio, near and far fields
                        min_zoom, max_zoom){	// how far the camera can zoom.

	this.initLines();
	this.animate_count = 0;

    this.matrix_rotate_distance = matrix_rotate_distance;
    this.options = options;
    this.rotations = {  xy: Matrix.rotateXY_4d(matrix_rotate_distance),
                        yz: Matrix.rotateYZ_4d(matrix_rotate_distance),
                        zx: Matrix.rotateZX_4d(matrix_rotate_distance),
                        xw: Matrix.rotateXW_4d(matrix_rotate_distance),
                        wy: Matrix.rotateWY_4d(matrix_rotate_distance),
                        wz: Matrix.rotateWZ_4d(matrix_rotate_distance)}

	// The rotation that the animate() function will use on the graph. xw is the most impressive.
	// this.current_rotation = this.rotations.xw;
	this.current_rotation = this.rotations.xw.multiply(this.rotations.wy).multiply(this.rotations.wz).multiply(this.rotations.xy).multiply(this.rotations.yz).multiply(this.rotations.zx);

	// Rendering and animation must be started by onload.js.
	this.stop_render = true;
    this.stop_animate = true;

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
	if (!Graph.stop_animate){
		if (Graph.animate_count % Graph.options.animate_wait == 0){
			Graph.animate();
			Graph.animate_count = 0;
		}
		Graph.animate_count++;
	}

    if (!Graph.stop_render){
        requestAnimationFrame(Graph.renderLoop);
        Graph.render();
    }
}

/*
Stop the renderLoop.
*/
Graph.stopRender = function() {
    this.stop_render = true;
}

/*
Start the renderLoop.
*/
Graph.startRender = function() {
    this.stop_render = false;
    this.renderLoop();
}

/*
Contains everything that should happen in one single drawing of the image.
The image is updated, the controls are updated, and the light is moved to the correct position.
*/
Graph.render = function() {
    this.controls.update();
    this.light.position.copy(this.camera.position);
    this.renderer.render(this.scene, this.camera);
}

Graph.stopAnimate = function() {
    this.stop_animate = true;
}

Graph.startAnimate = function() {
    this.stop_animate = false;
}

/*
Completes one animation of the graph.
Transforms the basic vectors, then perspectifies them in preparation for graphing.
It then goes through every mesh. If the mesh is a sphere, it just updates its position.
If it is an extrusion, it is given a new geometry with the transformed perspective line.
*/
Graph.animate = function(options) {
	this.transformVectors(this.points, this.current_rotation);
	this.perspectify(this.points, this.perspective_points);
	var points_index = 0;
	var lines_index = 0;

	for (index in this.meshes){
		if (this.meshes[index].isASphere){
			this.meshes[index].position.copy(this.perspective_points[points_index]);
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
					this.perspective_lines[lines_index][0].clone(),
					this.perspective_lines[lines_index][1].clone())}
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
	for (index in lines){
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

	for (index in points){
		var sphere_mesh = new THREE.Mesh(
			new THREE.SphereGeometry(this.options.radius, this.options.sphere_segments, this.options.sphere_segments),
			new THREE.MeshLambertMaterial({color: this.options.color, wireframe: this.options.wireframe})		// We need Phong because Lambert won't do flat shading.
		)
		sphere_mesh.isASphere = true;
		sphere_mesh.position.set(points[index].x, points[index].y, points[index].z)		// Have to set the actual position with spheres.
		sphere_mesh.geometry.verticesNeedUpdate = false;
		sphere_mesh.frustumCulled = false;

		this.scene.add(sphere_mesh);
		this.meshes.push(sphere_mesh);
	}
}

Graph.clear = function() {
	for (index in this.points){
		this.points[index] = null;
		this.perspective_points[index] = null;
	}

	this.points = null;
	this.lines = null;
	this.perspective_points = null;
	this.perspective_lines = null;

	for (index in this.meshes){
		this.scene.remove(this.meshes[index]);
		this.meshes[index].geometry.dispose();
		this.meshes[index].material.dispose();
	}
	this.meshes = null;
	this.stopAnimate();
}

/*
Create the starting lines and points for the graph.
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

	// Does the same thing as above, but then perspectifies them. These are the points that will actually
	// be used in graphing.
	this.perspective_lines = this.arrayToVectors(this.array_lines);
	this.perspective_points = this.aliasVectorLinesToPoints(this.perspective_lines);
	this.perspectify(this.points, this.perspective_points);
}

Graph.reset = function() {
	this.clear();
	this.meshes = [];
	this.initLines();
}
