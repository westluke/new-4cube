// Holds and applies methods to groups of GraphObjects
// Will receive data from Data object, but uses it to plot new GraphObjects

var Graph = function(	gl,
						color,
						wireframe,
						radius,
						sphere_segments,
						tube_segments
						) {
	this.gl = gl;

	this.tubes = [];
	this.spheres = [];

	this.sphere_geo = new THREE.SphereGeometry(radius, sphere_segments, sphere_segments);

	this.shapeWrap = new ShapeWrapper(radius, tube_segments);

	this.material = new THREE.MeshLambertMaterial({
		wireframe: wireframe,
		color: new THREE.Color(color[0] / 255, color[1] / 255, color[2] / 255)
	});
}

Graph.prototype.plotSphere = function(v) {
	var s = new Sphere(this.sphere_geo, v, this.material);
	this.spheres.push(s);
	this.gl.addToScene(s.mesh);
}

Graph.prototype.plotTube = function(line) {
	var t = new Tube(this.shapeWrap, this.material, line);
	this.tubes.push(t);
	this.gl.addToScene(t.mesh);
}

Graph.prototype.removeSphere = function(index) {
	this.gl.removeFromScene(this.spheres[index].mesh);
	this.spheres[index] = null;
	this.spheres.splice(index, 1);
}

Graph.prototype.removeTube = function(index) {
	this.gl.removeFromScene(this.tubes[index].destroy());
	this.tubes[index] = null;
	this.tubes.splice(index, 1);
}

// Will also update all the GraphObjects.
Graph.prototype.updateMaterials = function(color, wireframe) {
	this.material.color.r = color[0] / 255;
	this.material.color.g = color[1] / 255;
	this.material.color.b = color[2] / 255;
	this.material.wireframe = wireframe;
}

Graph.prototype.updateTubeShape = function(radius, segments) {
	this.shapeWrap.updateShape(radius, segments);
	this.remakeTubeGeos();
}

Graph.prototype.changeSphereGeo = function(radius, segments) {
	this.sphere_geo.dispose();
	this.sphere_geo = new THREE.SphereGeometry(radius, segments, segments);
	this._remakeSphereGeos();
}

Graph.prototype._remakeSphereGeos = function() {
	for (var i = 0; i < this.spheres.length; i++) {
		this.spheres[i].remakeGeo(this.sphere_geo);
	}
}

Graph.prototype.remakeTubeGeos = function() {
	for (var i = 0; i < this.tubes.length; i++) {
		this.tubes[i].remakeGeo();
	}
}

Graph.prototype.updateSpherePositions = function() {
	for (var i = 0; i < this.spheres.length; i++) {
		this.spheres[i].updatePosition();
	}
}

Graph.prototype.reset = function() {
	for (var i = 0; i < this.spheres.length; i++){
		this.gl.removeFromScene(this.spheres[i].mesh);
		this.spheres[i].mesh = null;
		this.spheres[i] = null;
	}
	this.spheres = [];

	for (var i = 0; i < this.tubes.length; i++){
		this.gl.removeFromScene(this.tubes[i].destroy());
		this.tubes[i].mesh = null;
		this.tubes[i] = null;
	}
	this.tubes = [];
}

Graph.prototype.destroy = function() {
	this.reset();
	this.spheres = null;
	this.tubes = null;

	this.sphere_geo.dispose();
	this.sphere_geo = null;

	this.shapeWrap.destroy();
	this.shapeWrap = null;

	this.material.dispose();
	this.material = null;
}
