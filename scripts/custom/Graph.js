// Holds and applies methods to groups of GraphObjects
// Will receive data from Data object, but uses it to plot new GraphObjects

// Needs to hold separate lists of tubes and spheres
// Needs: transformation function?
// must get those new points from data

// change color / wireframe
// change radius / segments

var Graph = function(gl) {
	this.gl = gl;

	this.tubes = [];
	this.spheres = [];
	this.color = null;
	this.radius = null;
	this.sphere_segments = null;
	this.tube_segments = null;
}


// OR, Data checks whether this stuff is already there, not Graph
// Makes me slightly uncomfortable that Data will seem to be superior to Graph, in that it has more control over how points are added.
// BUT, it makes no sense to have a check this far down the line, so it has to ahppen in data
// Need to make sure that the number of tubes and points always align
Graph.prototype.plotSphere = function(v) {
}

Graph.prototype.plotTube = function(v1, v2) {
}

Graph.prototype.updateMaterials = function(mat_args) {

}

Graph.prototype.updateShapes = function(args) {

}

Graph.prototype.updatePositions = function(sphere_points, tube_lines) {

}

Graph.prototype.destroy = function() {

}
