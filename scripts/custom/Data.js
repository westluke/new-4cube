var Data = function() {
	this.points = [];
	this.lines = [];

	// Actually, do we really ever have to hang on to these?
	// Also, what kind of object should each line be? a curve? a custom object?
	// Probably better to use my own, want some custom functionality
	this.ppoints = [];
	this.plines = [];
}


// I KNOW THESE FUNCTIONS CAN BE BETTER
// MAKE A SEARCHING FUNCTION? LINE INITIALIZATION FUNCTION?
/*
REAL GOAL RIGHT NOW: FIND ANY CLEAN WAY TO REVERSIBLY ALIAS BETWEEN POINTS AND LINES,
EASILY REDISCOVERING THE ALIASED CONNECTIONS. MAKE THESE ARRAYS OF POINTS AND LINES EASILY MODIFIABLE,
REDUCIBLE, AND EXPANDABLE, WITH CLEAN, STRAIGHTFORWARD CODE.
*/

// Shouldn't clone the vectors here, would create too many.
Data.prototype.addLine = function(v1, v2) {
	var line = new Line();
	var pline = new Line();

	indices = this.findPointIndices()

	if (indices[0] >= 0){
		line.aliasV1(points[indices[0]]);
		pline.aliasV1(points[indices[0]]);
	} else {
		var ppoint = v1.clone();
		points.push(v1);
		ppoints.push(ppoint);

		line.aliasV1(v1);
		pline.aliasV1(ppoint);
	}

	if (indices[1] >= 0){
		line.aliasV1(points[indices[1]]);
		pline.aliasV1(points[indices[1]]);
	} else {
		var ppoint = v2.clone();
		points.push(v2);
		ppoints.push(ppoint);

		line.aliasV1(v2);
		pline.aliasV1(ppoint);
	}

	this.lines.push(line);
	this.plines.push(pline);
}

Data.prototype.lineExists = function(line) {

}

Data.prototype.removeLine = function(index) {

}

// use to replace pieces in line adding methods.
// returns form of [v1Index, v2Index]
Data.prototype.findPointIndices = function(v1, v2) {
	var ret = [-1, -1];

	for (var i = 0; i < this.points.length; i++) {
		if (v1.equals(this.points[i])){
			ret[0] = i;
		}
		if (v2.equals(this.points[i])){
			ret[1] = i;
		}
		if (ret[0] >= 0 && ret[1] >= 0){
			break;
		}
	}

	return ret;
}

Data.prototype.perspective = function(points, ppoints, plane) {
	for (var i = 0; i < points.length; i++){
		ppoints[i].set(	points[i].x / (2 - points[i].w / plane),
						points[i].y / (2 - points[i].w / plane),
						points[i].z / (2 - points[i].w / plane),
						plane);
	}
}

// Precondition: the data object's arrays are empty and of length 0
Data.prototype.initializeCube = function(initLines) {
	var v1Index;
	var v2Index;

	for (var lineIndex = 0; lineIndex < initLines.length; lineIndex ++){
		v1Index = -1;
		v2Index = -1;

		this.lines[lineIndex] = new Line();
		this.plines[lineIndex] = new Line();

		for (var pointIndex = 0; pointIndex < this.points.length; pointIndex ++){
			if (Data.compareArrayToVector(initLines[lineIndex][0], this.points[pointIndex])){
				v1Index = pointIndex;
			}

			if (Data.compareArrayToVector(initLines[lineIndex][1], this.points[pointIndex])){
				v2Index = pointIndex;
			}
		}

		if (v1Index >= 0){
			this.lines[lineIndex].aliasV1(this.points[v1Index]);
			this.plines[lineIndex].aliasV1(this.ppoints[v1Index]);

		} else {
			var newPoint = new THREE.Vector4(0, 0, 0, 0);
			newPoint.fromArray(initLines[lineIndex][0]);
			var newPPoint = newPoint.clone();

			this.points.push(newPoint);
			this.ppoints.push(newPPoint);

			this.lines[lineIndex].aliasV1(newPoint);
			this.plines[lineIndex].aliasV2(newPPoint);
		}

		if (v2Index >= 0){
			this.lines[lineIndex].aliasV2(this.points[v2Index]);
			this.plines[lineIndex].aliasV2(this.ppoints[v2Index]);

		} else {
			var newPoint = new THREE.Vector4(0, 0, 0, 0);
			newPoint.fromArray(initLines[lineIndex][1]);
			var newPPoint = newPoint.clone();

			this.points.push(newPoint);
			this.ppoints.push(newPPoint);

			this.lines[lineIndex].aliasV2(newPoint);
			this.plines[lineIndex].aliasV2(newPPoint);
		}
	}

	var subtractor = new THREE.Vector4(0.5, 0.5, 0.5, 0.5);
	for (var i = 0; i < this.points.length; i++){
		this.points[i].sub(subtractor);
	}

	this.perspective(this.points, this.ppoints);
}

// Should this call Graph's reset function?
// I don't think so, not its business.
Data.prototype.reset = function() {
	for (var i = 0; i < this.points.length; i++) {
		this.points[i] = null;
	}
	this.points = [];

	for (var i = 0; i < this.lines.length; i++) {
		this.lines[i].destroy();
	}
	this.lines = [];
}

Data.compareArrayToVector = function(arr, v) {
	return (arr[0] == v.x &&
			arr[1] == v.y &&
			arr[2] == v.z &&
			arr[3] == v.w	);
}
