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

/*
Should return a new array of vector lines (only 3d) where the fourth dimension is used
to scale down the (x, y, z) coordinates of vectors towards the origin to generate 4d perspective.
*/
Graph.perspectify = function (points, perspective_points){
	var min_w = points[0].w;
	var vector_w = 0;
	var coord_array;
	var x; var y; var z; var w;
	var divisor;

	for (index in points){
		vector_w = points[index].w;

		if (vector_w < min_w){
			min_w = vector_w;
		}
	}

	var w_move = 1 - min_w;

	for (index in points){
		coord_array = points[index].toArray();
		x = coord_array[0];
		y = coord_array[1];
		z = coord_array[2];
		w = coord_array[3];
		divisor = w + w_move;
		perspective_points[index].set(x/divisor, y/divisor, z/divisor, 1);
	}
}

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

Graph.init = function(  options,				// parameters for the display of the graph
                        matrix_rotate_distance,	// rotation distance for the base rotation matrices
                        camera_coordinates,		// where the camera starts in the scene
                        camera_args,			// fov, aspect ratio, near and far fields
                        min_zoom, max_zoom){	// how far the camera can zoom.

	/*
	Slight problem that must be watched carefully:
		points and perspective_points must be absolutely parallel.
		Have to make sure that perspectify is safe, and that it is the only thing that operates
		on perspective_points.
	*/
	this.lines = this.arrayToVectors(this.array_lines);
	this.points = this.aliasVectorLinesToPoints(this.lines);
	this.center(this.points);
	console.log(this.points);

	this.perspective_lines = this.arrayToVectors(this.array_lines);
	this.perspective_points = this.aliasVectorLinesToPoints(this.perspective_lines);
	this.perspectify(this.points, this.perspective_points);
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
	// this.current_rotation = this.rotations.xw.multiply(this.rotations.wy).multiply(this.rotations.wz);
	this.current_rotation = this.rotations.xw;

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

Graph.animate = function(options) {
	this.transformVectors(this.points, this.current_rotation);
	this.perspectify(this.points, this.perspective_points);
	var points_index = 0;
	var lines_index = 0;

	for (index in this.meshes){
		if (this.meshes[index].isASphere){
			this.meshes[index].position.copy(this.perspective_points[points_index]);
			points_index++;
			// console.log("Sphere");
		} else {
			this.meshes[index].geometry.dispose();
			this.meshes[index].geometry = new THREE.ExtrudeGeometry(
				new THREE.Shape(
					(new THREE.CircleGeometry(0.05, 20, 20)).vertices.slice(1, 21)
				),
				{extrudePath: new THREE.LineCurve3(
					this.perspective_lines[lines_index][0].clone(),
					this.perspective_lines[lines_index][1].clone())}
			);
			lines_index++;
		}
	}
	// for (index in this.meshes){
	// 	this.meshes[index].geometry.applyMatrix(Graph.rotations.xy);
	// 	this.meshes[index].position.copy(this.meshes[index].position.applyMatrix4(Graph.rotations.xy));
	// }
}

/*
Add the lines described in vector_lines to the graph, and store them for future transformations.
options is of the form {color: ?, shape_segments: ?, sphere_segments: ?, radius: ?}
Just to be careful, plot should be cloning vectors, not aliasing them into the geometries.
*/
Graph.plot = function(lines, points, options){
	for (index in lines){
		// This ungodly mess is to avoid memory leaks at all costs.
		var mesh = new THREE.Mesh(
			new THREE.ExtrudeGeometry(
				new THREE.Shape(
					(new THREE.CircleGeometry(options.radius, options.shape_segments)).vertices.slice(1, options.shape_segments + 1)
				),
				{extrudePath: new THREE.LineCurve3(lines[index][0].clone(), lines[index][1].clone())}
			),
			new THREE.MeshLambertMaterial({color: options.color})
		);
		mesh.isASphere = false;
		mesh.geometry.verticesNeedUpdate = true;
		mesh.frustumCulled = false;

		this.scene.add(mesh);
		this.meshes.push(mesh);
	}

	for (index in points){
		var sphere_mesh = new THREE.Mesh(
			new THREE.SphereGeometry(options.radius, options.sphere_segments),
			new THREE.MeshPhongMaterial({color: options.color, shading: THREE.FlatShading})
		)
		sphere_mesh.isASphere = true;
		sphere_mesh.position.set(points[index].x, points[index].y, points[index].z)
		sphere_mesh.geometry.verticesNeedUpdate = true;
		sphere_mesh.frustumCulled = false;

		this.scene.add(sphere_mesh);
		this.meshes.push(sphere_mesh);
	}
}
