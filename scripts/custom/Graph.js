var Graph = new Object();

/*
During program execution, the real 4d points and lines are kept in vector form
In the plot stage, the vector_lines and points are perspectified, and the new perspetive points stored in a list
the vectors in that list are cloned into the proper meshes, and then the perspective list is destroyed completely

shit. The animate stage will have to be very very different

during the animate loop, what happens?
the actual 4d vectors need to be transformed with the current rotation
then they need to be perspectified (very quick actually), and passed into the meshes somehow. HOW?
can I just update their geometries? that was the old approach, and I think it's best. make new geometry each time, delete the old.

Oh. I would have had to do that anyways, because I'm transforming 4d vectors, not 3d.

Perspectify: pretend that the point with the lowest w-value is actually at w=1, with the rest of the shape moved
				accordingly. Now, for every point, divide the x, y, and z-values by the point's w-value

should I store vector_lines AND vector_points? I think so.
perspective lines and points are NEVER stored. There is no point in storing them, because we only transform the others.


NEW STRUCTURE:
the only thing we change is the points lists.
The lines lists actually only contain references to the vectors in the points lists, so we only need to change those.
This means that we need to build the points lists, then use a connections matrix to build the lines lists.

THEN we copy the vectors into a perspective points list, and reference those in a perspective lines list.

ORDER OF IMPLEMENTATION:
get connections array
make the function to build the vector_lines based off the vector_points
test that transforming the vector_points transforms the vector_lines

how should plot work now?
make a new function that does the geometry creation, so it can be used in animate

Also, for efficiency,  extrusion geometries should only ever use LambertMaterials
and sphere geometries should only ever use PhongMaterials. Need to recognize which is which in animate().

function takes in vector_lines array, produces aliased vector_points arrays
also goes through original array, and if any vectors are the same, those are aliased to each other.

*/

// The Plot function will only be an initial thing. It will then store an array of geometries that can
// be transformed in the animate stage, without generating new materials.

// The initial collection of lines to graph.
// Pairs lists of coordinates for the points in 4d space.
// Hardcoded to save work.

// These need to be passed in to a function that can apply the perspective projection transformation
// The results will be passed into a plotting function
// All other transformations operate on the original set of points, NOT the perspectified set.
// Therefore, the above transformation needs to occur every rendering, at least.

// These should immediately be converted into a similar array of vector pairs.
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

Graph.meshes = [];

/*
Converts an array of lines in array format, like the one above, into an array of lines in vector format.
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

/*
Takes in an array of vector lines.
It then constructs an array of vector points of all the points present in vector_lines.
It does not create new vectors, it aliases those in vector_lines.
If 2 vectors in vector_lines are equal, they are aliased together as well.
*/
Graph.aliasVectorLinesToPoints = function(vector_lines){
	// WORKS

	var vector_points = [];
	var v1_found;
	var v2_found;

	for (index in vector_lines){
		var v1 = vector_lines[index][0];
		var v2 = vector_lines[index][1];
		v1_found = false;
		v2_found = false;

		for (index2 in vector_points){
			if (vector_points[index2].equals(v1)){
				vector_lines[index][0] = vector_points[index2];
				v1_found = true;
			}

			if (vector_points[index2].equals(v2)){
				vector_lines[index][1] = vector_points[index2];
				v2_found = true;
			}
		}
		if (!v1_found){
			vector_points.push(v1);
		}

		if (!v2_found){
			vector_points.push(v2);
		}
	}
	return vector_points;
}

// Graph.cloneVectorPoints = function (vector_points){
// 	var new_vector_points = [];
//
// 	for (index in vector_points){
// 		new_vector
// 	}
// }

// /*
// Should return a new array of vector lines (only 3d) where the fourth dimension is used
// to scale down the (x, y, z) coordinates of vectors towards the origin to generate 4d perspective.
// */
// Graph.perspectify = function (vector_lines, center_of_projection, camera_space_w_coordinate){
// 	var min_w = vector_lines[0][0].w;
// 	var v1_w = 0;
// 	var v2_w = 0;
// 	var new_vector_lines = [];
//
// 	for (index in vector_lines){
// 		v1_w = vector_lines[index][0].w;
// 		v2_w = vector_lines[index][1].w;
// 		if (v1_w < min_w){
// 			min_w = v1_w;
// 		}
// 		if (v2_w < min_w){
// 			min_w = v2_w;
// 		}
// 	}
//
// 	var w_move = 1 - min_w;
//
// 	for (index in vector_lines){
// 		var v1 = new THREE.Vector4(0, 0, 0, 0);
// 		var v2 = new THREE.Vector4(0, 0, 0, 0);
// 		v1.copy(vector_lines[index][0]);
// 		v2.copy(vector_lines[index][1]);
// 		v1.x /= (v1.w + w_move);
// 		v1.y /= (v1.w + w_move);
// 		v1.z /= (v1.w + w_move);
// 		v2.x /= (v1.w + w_move);
// 		v2.y /= (v1.w + w_move);
// 		v2.z /= (v1.w + w_move);
// 		new_vector_lines.push([v1, v2]);
// 	}
// 	return new_vector_lines;
// }

Graph.init = function(  options,				// parameters for the display of the graph
                        matrix_rotate_distance,	// rotation distance for the base rotation matrices
                        camera_coordinates,		// where the camera starts in the scene
                        camera_args,			// fov, aspect ratio, near and far fields
                        min_zoom, max_zoom){	// how far the camera can zoom.

	this.lines = this.arrayToVectors(this.array_lines);
	this.points = this.aliasVectorLinesToPoints(this.lines);
	this.perspective
	// console.log(this.lines);

    this.matrix_rotate_distance = matrix_rotate_distance;
    this.options = options;
    this.rotations = {  xy: Matrix.rotateXY_4d(matrix_rotate_distance),
                        yz: Matrix.rotateYZ_4d(matrix_rotate_distance),
                        zx: Matrix.rotateZX_4d(matrix_rotate_distance),
                        xw: Matrix.rotateXW_4d(matrix_rotate_distance),
                        wy: Matrix.rotateWY_4d(matrix_rotate_distance),
                        wz: Matrix.rotateWZ_4d(matrix_rotate_distance)}

	// The rotation that the animate() function will use on the graph.
	this.current_rotation = this.rotations.xw.multiply(this.rotations.wy).multiply(this.rotations.wz);

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
	if (Graph.stop_animate == false){
		Graph.animate();
	}

    if (Graph.stop_render == false){
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

Graph.animate = function() {
	// for (index in this.meshes){
	// 	this.meshes[index].geometry.applyMatrix(Graph.rotations.xy);
	// 	this.meshes[index].position.copy(this.meshes[index].position.applyMatrix4(Graph.rotations.xy));
	// }
}

/*
Add the lines described in vector_lines to the graph, and store them for future transformations.
options is of the form {color: ?, shape_segments: ?, sphere_segments: ?, radius: ?}
*/
Graph.plot = function(vector_lines, options){



// CENTER FIRST



	// var vector_lines = this.perspectify(vector_lines, 0, 0);
	// console.log(vector_lines);
	//
	// for (index in vector_lines){
	// 	// This ungodly mess is to avoid memory leaks at all costs.
	// 	var mesh = new THREE.Mesh(
	// 		new THREE.ExtrudeGeometry(
	// 			new THREE.Shape(
	// 				(new THREE.CircleGeometry(options.radius, options.shape_segments)).vertices.slice(1, options.shape_segments + 1)
	// 			),
	// 			{extrudePath: new THREE.LineCurve3(vector_lines[index][0], vector_lines[index][1])}
	// 		),
	// 		new THREE.MeshLambertMaterial({color: options.color})
	// 	);
	// 	mesh.geometry.verticesNeedUpdate = true;
	// 	mesh.frustumCulled = false;
	//
	// 	var sphere_mesh1 = new THREE.Mesh(
	// 		new THREE.SphereGeometry(options.radius, 10),
	// 		new THREE.MeshPhongMaterial({color: options.color, shading: THREE.FlatShading})
	// 	)
	// 	sphere_mesh1.position.set(vector_lines[index][0].x, vector_lines[index][0].y, vector_lines[index][0].z)
	// 	sphere_mesh1.geometry.verticesNeedUpdate = true;
	// 	sphere_mesh1.frustumCulled = false;
	//
	// 	var sphere_mesh2 = new THREE.Mesh(
	// 		new THREE.SphereGeometry(options.radius, 10),
	// 		new THREE.MeshPhongMaterial({color: options.color, shading: THREE.FlatShading})
	// 	)
	// 	sphere_mesh2.position.set(vector_lines[index][0].x, vector_lines[index][0].y, vector_lines[index][0].z)
	// 	sphere_mesh2.geometry.verticesNeedUpdate = true;
	// 	sphere_mesh2.frustumCulled = false;

	// 	this.scene.add(mesh);
	// 	this.scene.add(sphere_mesh1);
	// 	this.scene.add(sphere_mesh2);
	// 	this.meshes.push(mesh);
	// 	this.meshes.push(sphere_mesh1);
	// 	this.meshes.push(sphere_mesh2);
	// }





	// var v1 = new THREE.Vector3(0, 0, 0);
	// var v2 = v1;
	// v2.set(20, 20, 20);
	//
	// var mesh = new THREE.Mesh(
	// 	new THREE.ExtrudeGeometry(
	// 		new THREE.Shape(
	// 			(new THREE.CircleGeometry(1, 8)).vertices.slice(1, 9)
	// 		),
	// 		{extrudePath: new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1))}
	// 	),
	// 	new THREE.MeshPhongMaterial({color: options.color, shading: THREE.FlatShading})
	// );
	// mesh.geometry.verticesNeedUpdate = true;
	// mesh.frustumCulled = false;
	//
	// // v1.set(20, 20, 20)
	//

	// var mesh = new THREE.Mesh(
	// 	new THREE.SphereGeometry(options.radius, 10),
	// 	new THREE.MeshLambertMaterial({color: options.color, shading: THREE.FlatShading})
	// )
	// this.scene.add(mesh);

	// var mesh = new THREE.Mesh(
	// 	new THREE.ExtrudeGeometry(),
	// 	new THREE.MeshPhongMaterial({color: options.color, shading: THREE.FlatShading}));
	// mesh.frustumCulled = false;
	// this.scene.add(mesh);
}
