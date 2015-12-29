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

*/

// These will be used to generate the spheres that mark off the ends of the lines, to make smooth curves.
Graph.points =
[[0, 0, 0, 0],
[0, 0, 0, 1],
[0, 0, 1, 1],
[0, 0, 1, 0],
[0, 1, 1, 0],
[0, 1, 0, 0],
[0, 1, 0, 1],
[0, 1, 1, 1],
[1, 1, 1, 1],
[1, 0, 1, 1],
[1, 0, 0, 1],
[1, 0, 0, 0],
[1, 0, 1, 0],
[1, 1, 1, 0],
[1, 1, 0, 0],
[1, 1, 0, 1]];

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
Graph.lines = [
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
Should return a new array of vector lines (only 3d) where the fourth dimension is used
to scale down the (x, y, z) coordinates of vectors towards the origin to generate 4d perspective.
*/
Graph.perspectify = function (vector_lines, center_of_projection, camera_space_w_coordinate){

}

Graph.init = function(  options,				// parameters for the display of the graph
                        matrix_rotate_distance,	// rotation distance for the base rotation matrices
                        camera_coordinates,		// where the camera starts in the scene
                        camera_args,			// fov, aspect ratio, near and far fields
                        min_zoom, max_zoom){	// how far the camera can zoom.

	this.vector_lines = this.arrayToVectors(this.lines);
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

    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshLambertMaterial( { color: this.options.color } );
    // this.cube = new THREE.Mesh( geometry, material );
    // this.cube.verticesNeedUpdate = true;
    // this.scene.add( this.cube );
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

Graph.animateLoop = function() {
    if (Graph.stop_animate == false){
        Graph.animate();
        setTimeout(Graph.animateLoop, 20);
    }
}

Graph.stopAnimate = function() {
    this.stop_animate = true;
}

Graph.startAnimate = function() {
    this.stop_animate = false;
    this.animateLoop();
}

Graph.animate = function() {
	for (index in this.meshes){
		this.meshes[index].geometry.applyMatrix(Graph.rotations.xy);
		this.meshes[index].position.copy(this.meshes[index].position.applyMatrix4(Graph.rotations.xy));
	}
}

/*
Add the lines described in vector_lines to the graph, and store them for future transformations.
options is of the form {color: ?, segments: ?, }
*/
Graph.plot = function(vector_lines, options){
	// var circle_geometry = new THREE.CircleGeometry(1, 8);
	// var shape_points = circle_geometry.vertices.slice(1, 9);
	// var shape = new THREE.Shape(shape_points);
	// var curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 2, 2));
	//
	// var geo = new THREE.ExtrudeGeometry(shape, {extrudePath: curve});
	// console.log(geo);
	// geo.verticesNeedUpdate = true;
	// var mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial());
	// mesh.frustumCulled = false;

	// This ungodly beast is pretty much the equivalent of the commented code above.
	// It's here to avoid assigning any variables to anything, because I've had memory leak issues.
	var mesh = new THREE.Mesh(
		new THREE.ExtrudeGeometry(
			new THREE.Shape(
				(new THREE.CircleGeometry(1, options.segments)).vertices.slice(1, 9)
			),
			{extrudePath: new THREE.LineCurve3(new THREE.Vector3(5, 5, 5), new THREE.Vector3(0, 0, 0))}
		),
		new THREE.MeshLambertMaterial({color: 0xED5749})
	);
	mesh.geometry.verticesNeedUpdate = true;
	mesh.frustumCulled = false;

	// for (index in lines){
	// 	var mesh = new THREE.Mesh(
	// 		new THREE.ExtrudeGeometry(
	// 			new THREE.Shape(
	// 				(new THREE.CircleGeometry(1, options.segments)).vertices.slice(1, options.segments + 1)
	// 			),
	// 			{extrudePath: new THREE.LineCurve3(new THREE.Vector3(5, 5, 5), new THREE.Vector3(0, 0, 0))}
	// 		),
	// 		new THREE.MeshLambertMaterial({color: 0xED5749})
	// 	);
	// }

	// var sphere_mesh = new THREE.Mesh(
	// 	new THREE.SphereGeometry(1, 32, 32),
	// 	new THREE.MeshBasicMaterial({color: 0xED5749})
	// )
	//
	// var sphere_mesh2 = new THREE.Mesh(
	// 	new THREE.SphereGeometry(1, 32, 32),
	// 	new THREE.MeshBasicMaterial({color: 0xED5749})
	// )
	//
	// sphere_mesh.geometry.verticesNeedUpdate = true;
	// sphere_mesh2.geometry.verticesNeedUpdate = true;
	//
	// sphere_mesh.position.set(0, 0, 0);
	// sphere_mesh2.position.set(5, 5, 5);

	var geometry = new THREE.SphereGeometry(1, 10);
	var material = new THREE.MeshPhongMaterial({shading: THREE.FlatShading});
	var cube = new THREE.Mesh(geometry, material);
	this.scene.add(cube);

	// this.scene.add(mesh);
	// this.scene.add(sphere_mesh2);
	// this.scene.add(sphere_mesh);
	// this.meshes.push(mesh);
	// this.meshes.push(sphere_mesh2);
	// this.meshes.push(sphere_mesh);
}
