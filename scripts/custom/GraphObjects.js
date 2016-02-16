// These represent the actual objects being displayed through webgl.
// For tubes, their shape and material are constant for all, so they can be aliased.
// The line is aliased so that it updates immediately when Data perspectifies.
// The shapes are wrapped in a shapeWrapper for ease of aliasing.

var Tube = function (	shapeWrap,
						material,
						line	// a Line object containing the curve
						) {

	this.shapeWrap = shapeWrap;
	this.line = line;

	// Create the mesh from all the pieces
	// Geometry is a cylinder stretched along the curve.
	this.mesh = new THREE.Mesh(
		new THREE.ExtrudeGeometry(
			this.shapeWrap.shape,
			{extrudePath: this.line.curve}
		), material);
}

// For when the aliased line is changed from outside and the graph needs to respond.
// Also should be called when the shape is changed.
Tube.prototype.remakeGeo = function() {

	// If the curve had length 0 before, it keeps length 0 until the arcLengths are updated.
	if (this.line.curve.getLength() == 0){
		this.line.curve.updateArcLengths();
	}

	this.mesh.geometry.dispose();
	this.mesh.geometry = new THREE.ExtrudeGeometry(this.shapeWrap.shape, {extrudePath: this.line.curve});
}

Tube.prototype.destroy = function() {
	this.mesh.geometry.dispose();
	return this.mesh;
}





// The situation is different for spheres. Their geometries and materials are constant for all,
// but we can't alias geometries if we want to change their position. Cloning them is quite efficient though,
// so we do that instead of remaking the geometries.
var Sphere = function (	geo,
						position,
						material
						) {

	this.position = position;

	this.mesh = new THREE.Mesh(geo, material)
	this.updatePosition();
}

Sphere.prototype.remakeGeo = function(geo) {
	this.mesh.geometry.dispose();
	this.mesh.geometry = geo;
}

Sphere.prototype.updatePosition = function() {
	this.mesh.position.copy(this.position);
}





var ShapeWrapper = function (radius, segments) {
	this.circle = new THREE.CircleGeometry(radius, segments);
	this.shape = new THREE.Shape(this.circle.vertices.slice(1, segments + 1));
}

ShapeWrapper.prototype.updateShape = function(radius, segments) {
	this.circle.dispose();
	this.circle = new THREE.CircleGeometry(radius, segments);
	this.shape = new THREE.Shape(this.circle.vertices.slice(1, segments + 1));
}
