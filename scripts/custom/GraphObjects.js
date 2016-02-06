var Tube = function (	color,
						wireframe,
						radius,
						segments,
						start,
						end) {

	this.color = color;
	this.wireframe = wireframe;
	this.radius = radius;
	this.segments = segments;

	this.curve = new THREE.LineCurve3(
		start.clone(),
		end.clone()
	);

	// Creates a circle shape, which I can pull vertices out of to build the tube.
	this.circle = new THREE.CircleGeometry(radius, segments);

	// Pulls the necessary vertices from the circle.
	this.shape = new THREE.Shape(this.circle.vertices.slice(1, segments + 1));

	// Creates a cylinder geometry from the circle, along the curve
	this.geo = new THREE.ExtrudeGeometry(this.shape, {extrudePath: this.curve});

	// Lambert materials permit shading
	this.material = new THREE.MeshLambertMaterial({
		color: new THREE.Color(	color[0],
								color[1],
								color[2]	),
		wireframe: wireframe
	});

	// Create the mesh from all the pieces
	this.mesh = new THREE.Mesh(this.geo, this.material);
}

// args is {radius, segments}
Tube.prototype.updateShape = function(args) {
	this.radius = args.radius || this.radius;
	this.segments = args.segments || this.segments;

	this.circle.dispose();

	this.circle = new THREE.CircleGeometry(
		this.radius,
		this.segments
	)

	this.shape = new THREE.Shape(this.circle.vertices.slice(1, this.segments + 1));

	this.geo.dispose();
	this.geo = new THREE.ExtrudeGeometry(this.shape, {extrudePath: this.curve});

	this.mesh.geometry = this.geo;
}

// mat_args is {color, wireframe}
Tube.prototype.updateMaterial = function(mat_args) {
	this.color = mat_args.color || this.color;
	this.wireframe = mat_args.wireframe || this.wireframe;

	this.material.color = new THREE.Color(	this.color[0],
											this.color[1],
											this.color[2]	);

	this.material.wireframe = this.wireframe;
}

// Change the position of the tube
Tube.prototype.updatePath = function(v1, v2) {
	this.curve.v1.copy(v1);
	this.curve.v2.copy(v2);
	this.updateShape({});
}

Tube.prototype.destroy = function(remover) {
	this.color = null;
	this.wireframe = null;
	this.radius = null;
	this.segments = null;

	this.curve.v1 = null;
	this.curve.v2 = null;
	this.curve = null;

	this.circle.dispose();
	this.shape = null;
	this.geo.dispose();
	this.material.dispose();

	return this.getMesh();
}

Tube.prototype.getMesh = function() {
	return this.mesh;
}

Tube.prototype.equals = function(tube) {
	TODO
}







var Sphere = function (	color,
						wireframe,
						radius,
						segments) {

	this.color = color;
	this.wireframe = wireframe;
	this.radius = radius;
	this.segments = segments;

	this.geo = new THREE.SphereGeometry(this.radius,
										this.segments,
										this.segments);

	this.material = new THREE.MeshLambertMaterial({
		color: new THREE.Color(this.color),
		wireframe: this.wireframe
	});

	this.mesh = new THREE.Mesh(this.geo, this.material)
}

Sphere.prototype.move = function(v) {
	this.mesh.position.copy(v);
}

Sphere.prototype.updateShape = function(args) {
	this.radius = args.radius || this.radius;
	this.segments = args.segments || this.segments;

	this.geo.dispose();
	this.geo = new THREE.SphereGeometry(this.radius,
										this.segments,
										this.segments);
	this.mesh.geometry = this.geo;
}

Sphere.prototype.updateMaterial = function(mat_args) {
	this.color = mat_args.color || this.color;
	this.wireframe = mat_args.wireframe || this.wireframe;

	this.material.color = new THREE.Color(	this.color[0],
											this.color[1],
											this.color[2]	);

	this.material.wireframe = this.wireframe;
}

Sphere.prototype.destroy = function() {
	this.color = null;
	this.wireframe = null;
	this.radius = null;
	this.segments = null;

	this.geo.dispose();
	this.material.dispose();

	return this.getMesh();
}

Sphere.prototype.getMesh = function() {
	return this.mesh;
}
