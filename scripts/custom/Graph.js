var Graph = new Object();

// The initial collection of lines to graph.
// Pairs lists of coordinates for the points in 4d space.
// Hardcoded to save work.
var lines = [
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

Graph.init = function(  options,				// parameters for the display of the graph
                        matrix_rotate_distance,	// rotation distance for the base rotation matrices
                        camera_coordinates,		// where the camera starts in the scene
                        camera_args,			// fov, aspect ratio, near and far fields
                        min_zoom, max_zoom){	// how far the camera can zoom.

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

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshLambertMaterial( { color: this.options.color } );
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.verticesNeedUpdate = true;
    this.scene.add( this.cube );
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
    Graph.cube.geometry.applyMatrix(Graph.rotations.xy);
    Graph.cube.updateMatrix();

    // I'm not sure this stuff is actually needed, but it was recommended.
    // Graph.cube.matrix.identity();
    //
    // Graph.cube.position.set( 0, 0, 0 );
    // Graph.cube.rotation.set( 0, 0, 0 );
    // Graph.cube.scale.set( 1, 1, 1 );
}
