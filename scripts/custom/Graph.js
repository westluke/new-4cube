var Graph = new Object();

// Why store them this way? The way they will actually be stored is as pairs of points. Lets hardcode them that way, and take out a giant chunk of overhead.
POINTS =
[[0, 0, 0, 0],
[0, 0, 0, 1],
[0, 0, 1, 1],
[0, 0, 1, 0],
[0, 1, 1, 0],
[0, 1, 0, 0],
[0, 1, 0, 1],
[0, 1, 1, 1],
[1, 1, 1, 1],
[1, 0, 1, 1],
[1, 0, 0, 1],
[1, 0, 0, 0],
[1, 0, 1, 0],
[1, 1, 1, 0],
[1, 1, 0, 0],
[1, 1, 0, 1]];

var connections =
[[0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

function getLines(points, conns){
    // Converts a collections of points and a matrix of connections into a set of THREE.js 4d vectors

    var p_a, p_b, ret_line = [];

    for (var a = 0; a < points.length; a++){
        for (var b = 0; b < points.length; b++){
            if (conns[a][b] > 0.1){
                p_a = points[a].slice(0);
                p_b = points[b].slice(0);
                var v1 = new THREE.Vector4(p_a[0], p_a[1], p_a[2], p_a[3]);
                var v2 = new THREE.Vector4(p_b[0], p_b[1], p_b[2], p_b[3]);
                v1.round();
                v2.round();
                ret_line.push([v1, v2])
            }
        }
    }
    return ret_line;
}
var things = getLines(POINTS, connections);
for (thing in things){
    console.log(things[thing][0].toArray().toString() + "_____" + things[thing][1].toArray().toString());
}
console.log(getLines(POINTS, connections));
// try to just update underlying points/, not make all the extrusions again.

// function init(a=3){};
// Graph.init = function(b, a = 2){};

Graph.init = function(  options,
                        matrix_rotate_distance,
                        camera_coordinates,
                        camera_args,
                        min_zoom, max_zoom){

    this.matrix_rotate_distance = matrix_rotate_distance;
    this.options = options;
    this.rotations = {  xy: Matrix.rotateXY_4d(matrix_rotate_distance),
                        yz: Matrix.rotateYZ_4d(matrix_rotate_distance),
                        zx: Matrix.rotateZX_4d(matrix_rotate_distance),
                        xw: Matrix.rotateXW_4d(matrix_rotate_distance),
                        wy: Matrix.rotateWY_4d(matrix_rotate_distance),
                        wz: Matrix.rotateWZ_4d(matrix_rotate_distance)}
    this.current_rotation = this.rotations.xw.multiply(this.rotations.wy).multiply(this.rotations.wz);

    this.camera = new THREE.PerspectiveCamera(camera_args.fov, camera_args.aspect_ratio, camera_args.near, camera_args.far);
    this.camera.position.set(camera_coordinates[0], camera_coordinates[1], camera_coordinates[2]);

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setPixelRatio( window.devicePixelRatio );
    document.getElementById('graph-container').appendChild(this.renderer.domElement);

    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
	this.controls.minDistance = min_zoom;
	this.controls.maxDistance = max_zoom;
    this.controls.noZoom = false;
    this.controls.noPan = true;

    this.light = new THREE.PointLight(0xffffff);
	this.light.position.copy(this.camera.position);
	this.scene.add(this.light);
}
