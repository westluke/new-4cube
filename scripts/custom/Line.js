// Holds data about the points in the line, and can be transformed.
// The inputs to the constructor are aliased to v1 and v2, which are also aliased
// to the v1 and v2 of the curve.

var Line = function(v1, v2) {
	this.v1 = v1;
	this.v2 = v2;
	this.curve = new THREE.LineCurve(this.v1, this.v2);
}

Line.prototype.containsPoint = function(v) {
	return (this.v1.equals(v) || this.v2.equals(v));
}

Line.prototype.equals = function(line) {
	return (	(this.v1.equals(line.v1) && this.v2.equals(line.v2)) ||
				(this.v2.equals(line.v1) && this.v1.equals(line.v2))	);
}

Line.prototype.transform = function(transform) {
	this.v1.applyMatrix4(transform);
	this.v2.applyMatrix4(transform);
}

Line.prototype.getLength = function() {
	return Math.sqrt(	Math.pow(this.v1.x - this.v2.x, 2) +
						Math.pow(this.v1.y - this.v2.y, 2) +
						Math.pow(this.v1.z - this.v2.z, 2) +
						Math.pow(this.v1.w - this.v2.w, 2)	);
}
