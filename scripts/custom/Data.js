// The functions here that interact with points don't call perspective() or calculateNewPlane() again,
// so we just have to remember to do that before rendering ? Is that a good plan?

var Data = function(graph) {
	this.graph = graph;
	this.points = [];
	this.lines = [];

	this.ppoints = [];
	this.plines = [];

	this.currentTransform = new THREE.Matrix4().identity();

	this.allSubTransforms = {
		xy: new THREE.Matrix4().identity(),
		yz: new THREE.Matrix4().identity(),
		zx: new THREE.Matrix4().identity(),
		xw: new THREE.Matrix4().identity(),
		wy: new THREE.Matrix4().identity(),
		wz: new THREE.Matrix4().identity()
	};
}

// Returns the index of the new lines added, or -1 if the adding failed.
Data.prototype.addLine = function(v1, v2, destroy) {

	if (this._lineExists(v1, v2)){
		// console.log("line exists");
		return -1;
	}

	var line = new Line();
	var pline = new Line();

	var v1s = this._addPoint(v1);

	line.aliasV1(v1s[0]);
	pline.aliasV1(v1s[1]);

	var v2s = this._addPoint(v2);

	line.aliasV2(v2s[0]);
	pline.aliasV2(v2s[1]);

	this.lines.push(line);
	this.plines.push(pline);

	this.calculateNewPlane();
	this.perspective();
	this.graph.plotTube(pline);

	// they're being cloned, so wouldn't affect the points adopted into the data object.
	if (destroy){
		v1 = null;
		v2 = null;
	}

	console.log(pline);

	// returns the index of the new line
	return this.lines.length - 1;
}

// If v is already in points, returns the matched point and its corresponding ppoint.
// If v is not already in points, inserts it in both, creates a new sphere, and returns two clones.
// Return type: [point, ppoint];
Data.prototype._addPoint = function(v) {
	for (var i = 0; i < this.points.length; i++){
		if (this.points[i].equals(v)){
			return [this.points[i], this.ppoints[i]];
		}
	}
	var point = v.clone();
	var ppoint = v.clone();

	this.points.push(point);
	this.ppoints.push(ppoint);

	this.graph.plotSphere(ppoint);

	return [point, ppoint];
}

// If any line contains the vector, nothing is done.
// If no line contains the vector, the vector is spliced out,
// the passed vector is freed, and the sphere at the index is destroyed.
Data.prototype._removePoint = function(v, index) {
	for (var i = 0; i < this.lines.length; i++) {
		if (this.lines[i].containsPoint(v)){
			return;
		}
	}

	for (var i = 0; i < this.points.length; i++) {
		if (this.points[i].equals(v)){
			this.points.splice(i, 1);
			this.ppoints.splice(i, 1);
			this.graph.removeSphere(i);
		}
	}

	v = null;

	this.calculateNewPlane();
	this.perspective();
}

// Returns true if the line is already in this.lines
Data.prototype._lineExists = function(v1, v2) {
	for (var i = 0; i < this.lines.length; i++){
		if (this.lines[i].containsPoint(v1) && this.lines[i].containsPoint(v2)){
			return true;
		}
	}
	return false;
}

// Removes a line from this.lines and the display, being careful not to delete objects
// that are still needed.
Data.prototype.removeLine = function(index) {
	if (index >= this.lines.length){
		throw "ERROR: index out of bounds in removeLine";
	}

	var line = this.lines.splice(index, 1)[0];

	// Doesn't delete these points if they are used by other lines.
	this._removePoint(line.curve.v1);
	this._removePoint(line.curve.v2);

	this.graph.removeTube(index);
}

// Calculates a new camera plane for the projection, ensuring that no points
// are behind the plane. The center of projection is always 1 unit behind the plane.
// Called on the addition of new lines.
Data.prototype.calculateNewPlane = function(){
	if (this.points.length == 0){
		console.log("nothing in points");
		this.plane = 0.5;
		return;
	}

	var maxLength = this.points[0].length();

	for (var i = 0; i < this.points.length; i++){
		if (this.points[i].length() > maxLength){
			maxLength = this.points[i].length();
		}
	}

	this.plane = maxLength;
}

// Calculates the projection of every 4d vector from this.lines,
// and copies the projected vectors into this.plines, allowing the graph to update.
Data.prototype.perspective = function() {
	// if (this.plane == undefined){
	// 	throw "ERROR: Plane undefined in Data.prototype.perspective";
	// }

	var divisor;

	// The projection is very simple: it scales down distance of each vector from the origin in 3d space
	// based on the distance between the w-coordinate and the center of projection.
	for (var i = 0; i < this.points.length; i++){
		// divisor = this.plane + 1 - this.points[i].w; // for when the center of projection is one unit behind the plane.
		divisor = 2 - this.points[i].w / this.plane; // for when the center of projection is twice as far as the plane.

		this.ppoints[i].set(this.points[i].x / (divisor),
							this.points[i].y / (divisor),
							this.points[i].z / (divisor),
							this.plane);
	}
}

// Precondition: the data object's arrays are empty and of length 0
// connections between points with different w-values not working.
Data.prototype.initializeCube = function(initLines) {
	this.reset();

	for (var i = 0; i < initLines.length; i ++){
		this.addLine(initLines[i][0], initLines[i][1], false);
	}

	// // Centers the 4cube around the origin
	// var subtractor = new THREE.Vector4(0.5, 0.5, 0.5, 0.5);
	//
	// for (var i = 0; i < this.points.length; i++){
	// 	this.points[i].sub(subtractor);
	// }

	this.calculateNewPlane();
	this.perspective();

	this.graph.remakeTubeGeos();
	this.graph.updateSpherePositions();
}

Data.prototype.reset = function() {
	for (var i = 0; i < this.points.length; i++) {
		this.points[i] = null;
		this.ppoints[i] = null;
	}
	this.points = [];
	this.ppoints = [];

	for (var i = 0; i < this.lines.length; i++) {
		this.lines[i].curve.v1 = null;
		this.lines[i].curve.v2 = null;
		this.lines[i].curve = null;
		this.lines[i] = null;

		this.plines[i].curve.v1 = null;
		this.plines[i].curve.v2 = null;
		this.plines[i].curve = null;
		this.plines[i] = null;
	}
	this.lines = [];
	this.plines = [];

	this.graph.resetPointsAndTubes();
}

Data.prototype.transform = function(matrix){
	for (var i = 0; i < this.points.length; i++){
		this.points[i].applyMatrix4(matrix);
	}

	this.perspective();
	this.graph.remakeTubeGeos();
	this.graph.updateSpherePositions();
}

Data.prototype.setTransform = function(key, value) {
	this.allSubTransforms[key] = Matrix[key](value);
}

Data.prototype.transformWithCurrentMatrix = function() {
	this.transform(this.currentTransform);
}

Data.prototype.produceCurrentTransform = function() {
	this.currentTransform.identity();
	var context = this;

	Object.keys(this.allSubTransforms).forEach(function(key) {
		context.currentTransform.multiply(context.allSubTransforms[key]);
	});
}

Data.prototype.clearTransforms = function() {
	var context = this;

	Object.keys(this.allSubTransforms).forEach(function(key) {
		context.allSubTransforms[key].identity();
	});
	this.currentTransform.identity();
}
