var Data = function() {
	this.points = [];
	this.lines = [];

	// Actually, do we really ever have to hang on to these?
	// Also, what kind of object should each line be? a curve? a custom object?
	// Probably better to use my own, want some custom functionality
	this.ppoints = [];
	this.plines = [];
}

Data.prototype.addLine = function() {

}

Data.prototype.lineExists = function(line) {

}

Data.prototype.perspective = function() {

}

// Precondition: the data object's arrays are empty
Data.prototype.initializeCube = function(initLines) {
	var v1Index;
	var v2Index;

	for (var lineIndex = 0; lineIndex < initLines.length; lineIndex ++){
		v1Index = -1;
		v2Index = -1;

		this.lines[lineIndex] = new Line(null, null);
		this.plines[lineIndex] = new Line(null, null);

		for (var pointIndex = 0; pointIndex < this.points.length; pointIndex ++){
			if (Data.compareArrayToVector(initLines[lineIndex][0], this.points[pointIndex])){
				v1Index = pointIndex;
			}

			if (Data.compareArrayToVector(initLines[lineIndex][1], this.points[pointIndex])){
				v2Index = pointIndex;
			}
		}

		if (v1Index >= 0){
			this.lines[lineIndex].v1 = this.points[v1Index];
			this.plines[lineIndex].v1 = this.ppoints[v1Index];

		} else {
			var newPoint = new THREE.Vector4(0, 0, 0, 0);
			newPoint.fromArray(this.lines[lineIndex]);
			var newPPoint = newPoint.clone();

			this.points.push(newPoint);
			this.ppoints.push(newPPoint;

			this.lines[lineIndex].v1 = newPoint;
			this.plines[lineIndex].v1 = newPPoint;
		}

		if (v2Index >= 0){
			this.lines[lineIndex].v2 = this.points[v1Index];
			this.plines[lineIndex].v2 = this.ppoints[v1Index];

		} else {
			var newPoint = new THREE.Vector4(0, 0, 0, 0);
			newPoint.fromArray(this.lines[lineIndex]);
			var newPPoint = newPoint.clone();

			this.points.push(newPoint);
			this.ppoints.push(newPPoint;

			this.lines[lineIndex].v2 = newPoint;
			this.plines[lineIndex].v2 = newPPoint;
		}
	}
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
