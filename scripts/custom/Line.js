// Holds data about the points in the line, and can be transformed.
// The inputs to the constructor are aliased to v1 and v2, which are also aliased
// to the v1 and v2 of the curve.

var Line = function() {
	this.curve = new THREE.LineCurve3(null, null);
}

Line.prototype.aliasV1 = function(v) {
	this.curve.v1 = v;
}

Line.prototype.aliasV2 = function(v) {
	this.curve.v2 = v;
}

Line.prototype.containsPoint = function(v) {
	return (this.curve.v1.equals(v) || this.curve.v2.equals(v));
}

Line.prototype.equals = function(line) {
	return (	(this.curve.v1.equals(line.curve.v1) && this.curve.v2.equals(line.curve.v2)) ||
				(this.curve.v2.equals(line.curve.v1) && this.curve.v1.equals(line.curve.v2))	);
}

Line.prototype.getLength = function() {
	return Math.sqrt(	Math.pow(this.curve.v1.x - this.curve.v2.x, 2) +
						Math.pow(this.curve.v1.y - this.curve.v2.y, 2) +
						Math.pow(this.curve.v1.z - this.curve.v2.z, 2) +
						Math.pow(this.curve.v1.w - this.curve.v2.w, 2)	);
}
