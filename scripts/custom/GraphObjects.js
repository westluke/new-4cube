// These represent the actual objects being displayed through webgl.

var Tube = function (	color,
						wireframe,
						radius,
						segments,
						line	// a Line object containing the curve
						) {

	this.color = color;
	this.wireframe = wireframe;
	this.radius = radius;
	this.segments = segments;
	this.line = line;

	// Creates a circle shape, which I can pull vertices out of to build the tube.
	this.circle = new THREE.CircleGeometry(radius, segments);

	// Pulls the necessary vertices from the circle.
	this.shape = new THREE.Shape(this.circle.vertices.slice(1, segments + 1));

	// Creates a cylinder geometry from the circle, along the curve
	this.geo = new THREE.ExtrudeGeometry(this.shape, {extrudePath: this.line.curve});

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

// For when the aliased line is changed from outside and the graph needs to respond.
Tube.prototype.remakeGeo = function() {
	this.geo.dispose();
	this.geo = new THREE.ExtrudeGeometry(this.shape, {extrudePath: this.line.curve});

	this.mesh.geometry = this.geo;
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

	this.remakeGeo();
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

Tube.prototype.destroy = function(remover) {
	this.color = null;
	this.wireframe = null;
	this.radius = null;
	this.segments = null;

	this.line.destroy();

	this.circle.dispose();
	this.shape = null;
	this.geo.dispose();
	this.material.dispose();

	return this.getMesh();
}

Tube.prototype.getMesh = function() {
	return this.mesh;
}






var Sphere = function (	color,
						wireframe,
						radius,
						segments,
						position
						) {

	this.color = color;
	this.wireframe = wireframe;
	this.radius = radius;
	this.segments = segments;

	this.position = position;

	this.geo = new THREE.SphereGeometry(this.radius,
										this.segments,
										this.segments);

	this.material = new THREE.MeshLambertMaterial({
		color: new THREE.Color(this.color),
		wireframe: this.wireframe
	});

	this.mesh = new THREE.Mesh(this.geo, this.material)
	this.mesh.position = this.position;
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
