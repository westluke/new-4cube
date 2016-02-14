// These represent the actual objects being displayed through webgl.
// For tubes, their shape and material are constant for all, so they can be aliased.
// The line is aliased so that it updates immediately when Data perspectifies.
// The shapes are wrapped in a shapeWrapper for ease of aliasing.

var Tube = function (	shapeWrap,
						material,
						line	// a Line object containing the curve
						) {

	this.shapeWrap, this.line;
	this.aliasLine(line);
	this.aliasShape(shapeWrap);

	// Creates a cylinder geometry from the circle, along the curve
	this.geo = new THREE.ExtrudeGeometry(this.shapeWrap.shape, {extrudePath: line.curve});

	// Create the mesh from all the pieces
	this.mesh = new THREE.Mesh(this.geo, material);
}

// For when the aliased line is changed from outside and the graph needs to respond.
// Also should be called when the shape is changed.
Tube.prototype.remakeGeo = function() {
	if (this.line.curve.getLength() == 0){
		this.line.curve.updateArcLengths();
	}

	this.geo.dispose();
	this.mesh.geometry.dispose();
	this.mesh.geometry = null;
	this.geo = new THREE.ExtrudeGeometry(this.shapeWrap.shape, {extrudePath: this.line.curve});

	this.mesh.geometry = this.geo;
	// console.log(this.geo);
}

Tube.prototype.aliasMaterial = function(material) {
	this.mesh.material.dispose();
	this.mesh.material = material;
}

Tube.prototype.aliasShape = function(shapeWrap) {
	this.shapeWrap = shapeWrap;
}

Tube.prototype.aliasLine = function(line){
	this.line = line;
}

Tube.prototype.destroy = function() {
	this.geo.dispose();

	return this.mesh;
}





// The situation is different for spheres. Their geometries and materials are constant for all,
// but we can't alias geometries if we want to change their position. Cloning them is quite efficient though,
// so we do that instead of remaking the geometries.
var Sphere = function (	geo,
						position,
						material
						) {

	this.aliasPosition(position);

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

Sphere.prototype.aliasMaterial = function(material) {
	this.mesh.material.dispose();
	this.mesh.material = material;
}

Sphere.prototype.aliasPosition = function(v) {
	this.position = v;
}

Sphere.prototype.destroy = function() {
	return this.mesh;
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

ShapeWrapper.prototype.destroy = function() {
	this.circle.dispose();
	this.shape = null;
}
