var GL = function(	graph_container,
					light_color,
					min_zoom,
					max_zoom,
					cam_args	// An object containing the fov, aspect_ratio, near_plane, far_plane, x, y, z
					){

    this.camera = new THREE.PerspectiveCamera(	cam_args.fov,
												cam_args.aspect_ratio,
												cam_args.near_plane,
												cam_args.far_plane);
    this.camera.position.set(	cam_args.x,
								cam_args.y,
								cam_args.z);

	// Point the camera at the origin
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setPixelRatio( window.devicePixelRatio );

	// Place the canvas within the document
    document.getElementById(graph_container).appendChild(this.renderer.domElement);

	// // Size the canvas properly
    this.fitNewSize();

	// Controls allow the graph to respond to mouse input
	// When the controls are first updated, the camera will be placed at the maximum zoom.
    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
	this.controls.minDistance = min_zoom;
	this.controls.maxDistance = max_zoom;
    this.controls.noPan = true;

	// For shading
    this.light = new THREE.PointLight(
		new THREE.Color(light_color[0],
						light_color[1],
						light_color[2]
	));

	this.addToScene(this.light);
}

GL.prototype.fitNewSize = function() {
	this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
}

GL.prototype.updateControls = function() {
	this.controls.update();
}

GL.prototype.moveLightToCamera = function() {
	this.light.position.copy(this.camera.position);
}

GL.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
}

GL.prototype.addToScene = function(obj) {
	this.scene.add(obj);
}

GL.prototype.removeFromScene = function(obj) {
	this.scene.remove(obj);
}
