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






var Line = function(v1, v2) {
	this.v1 = v1;
	this.v2 = v2;
	this.length = Math.sqrt(this.v1 * this.v1 + this.v2 * this.v2);
}

Line.prototype.equals = function(line) {
	return (	(this.v1.equals(line.v1) && this.v2.equals(line.v2)) ||
				(this.v2.equals(line.v1) && this.v1.equals(line.v2))	);
}

Line.prototype.containsPoint = function(v) {
	return (this.v1.equals(v) || this.v2.equals(v));
}

Line.prototype.transform = function(transform){
	this.v1.applyMatrix4(transform);
	this.v2.applyMatrix4(transform);
}

Line.prototype.set = function(vs){
	if (vs.v1){
		v1.copy(vs.v1);
	}

	if (vs.v2){
		v2.copy(vs.v2);
	}

	this.length = Math.sqrt(this.v1 * this.v1 + this.v2 * this.v2);
}

Line.prototype.getLength = function() {
	return this.length;
}

Line.prototype.maxDistanceToOrigin = function() {
	return Math.max(this.v1.length, this.v2.length)
}
