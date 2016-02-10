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
		xy: null,
		yz: null,
		zx: null,
		xw: null,
		wy: null,
		wz: null
	};

	// console.log(Object.keys(this.allSubTransforms));
}

// Shouldn't clone the vectors here, would create too many.
// actually maybe I should, otherwise the relationships are slightly different between lines and plines
// lines wouldn't clone, and plines would have to.
// Maybe the safer option is to clone here, and destroy the vectors after.
// FUCKING BROKEN
// lineExists is shit
Data.prototype.addLine = function(v1, v2) {
	if (this._lineExists(v1, v2)){
		return;
	}

	var line = new Line();
	var pline = new Line();

	var v1s = this._addPoint(v1);

	line.aliasV1(v1s[0]);
	pline.aliasV1(v1s[1]);

	var v2s = this._addPoint(v2);

	line.aliasV2(v2s[0]);
	pline.aliasV2(v2s[1]);

	v1 = null;
	v2 = null;

	this.graph.plotTube(pline);
}

// If v is already in points, returns the matched point and its corresponding ppoint.
// If v is not already in points, inserts it in both and returns two clones.
// Return type: [point, ppoint];
Data.prototype._addPoint(v) {
	for (int i = 0; i < this.points.length; i++){
		if (this.points[i].equals(v)){
			return [this.points[i], this.ppoints[i]];
		}
	}
	var point = v.clone();
	var ppoint = v.clone();
	this.points.push(point);
	this.ppoints.push(ppoint);

	return [point, ppoint];
}

// If any line contains the vector, nothing is done.
// If no line contains the vector, the vector is spliced out,
//the passed vector is freed, and the sphere at the index is destroyed.
Data.prototype._removePoint(v, index) {
	for (int i = 0; i < this.lines.length) {
		if (this.lines[i].containsPoint){
			return;
		}
	}

	for (int i = 0; i < this.points.length) {
		if (this.points[i].equals(v)){
			this.points.splice(i, 1);
			this.ppoints.splice(i, 1);
			this.graph.removeSphere(i);
		}
	}
	v = null;
}

Data.prototype._lineExists = function(v1, v2) {
	for (var i = 0; i < this.lines.length; i++){
		if (this.lines[i].containsPoint(v1) && this.lines[i].containsPoint(v2)){
			return true;
		}
	}
	return false;
}

// NO. What we need to do is check all the other lines to see if they also
// contain the matched points.
// Also need to remove spheres if necessary
// Make removePoint function?
Data.prototype.removeLine = function(index) {
	var v1Found = false;
	var v2Found = false;
	var line = this.lines.splice(index, 1)[0];
	this._removePoint(line.curve.v1);
	this._removePoint(line.curve.v2);

	this.graph.removeTube(index);
}

// use to replace pieces in line adding methods.
// returns form of [v1Index, v2Index]
Data.prototype.findPointIndices = function(v1, v2) {
	var ret = [-1, -1];

	for (var i = 0; i < this.points.length; i++) {
		if (v1.equals(this.points[i])){
			console.log("V1 " + i);
			ret[0] = i;
		}
		if (v2.equals(this.points[i])){
			console.log("V2 ");
			console.log(this.points);
			ret[1] = i;
		}
		if (ret[0] >= 0 && ret[1] >= 0){
			break;
		}
	}

	// console.log("indices " + ret);

	return ret;
}

Data.prototype.calculateNewPlane = function(){
	var maxLength = this.points[0].length();

	for (var i = 0; i < this.points.length; i++){
		if (this.points[i].length() > maxLength){
			maxLength = this.points[i].length();
		}
	}

	this.plane = maxLength;
}


Data.prototype.perspective = function() {
	for (var i = 0; i < this.points.length; i++){
		this.ppoints[i].set(this.points[i].x / (2 - this.points[i].w / this.plane),
							this.points[i].y / (2 - this.points[i].w / this.plane),
							this.points[i].z / (2 - this.points[i].w / this.plane),
							this.plane);
	}
}

// returns in form [v1Index, v2Index]
// Finds matching vectors when the passed in vector is in array form.
Data.prototype.findArrayToPointIndices = function(arr1, arr2) {
	var indices = [-1, -1];
	for (var pointIndex = 0; pointIndex < this.points.length; pointIndex ++){
		if (Data.compareArrayToVector(arr1, this.points[pointIndex])){
			indices[0] = pointIndex;
		}

		if (Data.compareArrayToVector(arr2, this.points[pointIndex])){
			indices[1] = pointIndex;
		}
	}
	return indices;
}

// Precondition: the data object's arrays are empty and of length 0
// connections between points with different w-values not working.
Data.prototype.initializeCube = function(initLines) {
	var v1Index;
	var v2Index;

	for (var i = 0; i < initLines.length; i ++){
		this.addLine(initLines[i][0], initLines[i][1]);
	}

	var subtractor = new THREE.Vector4(0.5, 0.5, 0.5, 0.5);
	for (var i = 0; i < this.points.length; i++){
		this.points[i].sub(subtractor);
	}

	this.calculateNewPlane();

	this.perspective();

	this.graph.remakeTubeGeos();
	this.graph.updateSpherePositions();

	// console.log(this.lines);
}

Data.prototype.reset = function() {
	for (var i = 0; i < this.points.length; i++) {
		this.points[i] = null;
	}
	this.points = [];

	for (var i = 0; i < this.lines.length; i++) {
		this.lines[i].destroy();
	}
	this.lines = [];

	Graph.resetPointsAndTubes();
}

Data.compareArrayToVector = function(arr, v) {
	return (arr[0] == v.x &&
			arr[1] == v.y &&
			arr[2] == v.z &&
			arr[3] == v.w	);
}

Data.prototype.transform = function(matrix){
	for (var i = 0; i < this.points.length; i++){
		this.points[i].applyMatrix4(matrix);
	}

	this.perspective();
	this.graph.remakeTubeGeos();
	this.graph.updateSpherePositions();
}

Data.prototype.setTransform = function(key, rotation) {
	this.allSubTransforms[key] = Matrix[key](rotation);
}

Data.prototype.transformWithCurrentMatrix = function() {
	this.transform(this.currentTransform);
}

Data.prototype.produceCurrentTransform = function() {
	this.currentTransform.identity();
	var test = this;

	Object.keys(this.allSubTransforms).forEach(function(key) {
		// console.log(this.allSubTransforms);
		if (test.allSubTransforms[key] != null){
			test.currentTransform.multiply(test.allSubTransforms[key]);
		}
	})
}
