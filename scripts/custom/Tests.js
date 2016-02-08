// var Tests = {
// 	cam_args: {
// 		fov: 60,
// 		aspect_ratio: 1,
// 		near_plane: 0.05,
// 		far_plane: 10,
// 		x: 0,
// 		y: 0,
// 		z: 3
// 	},
//
// 	gl: new GL("graph-container", [0.5, 1, 1], 0.1, 3, cam_args);
// 	animation: new
//
// 	testTube: function() {
// 		var cam_args = {
// 			fov: 60,
// 			aspect_ratio: 1,
// 			near_plane: 0.05,
// 			far_plane: 10,
// 			x: 0,
// 			y: 0,
// 			z: 3
// 		}
//
// 		var gl = new GL("graph-container", [0.5, 1, 1], 0.1, 3, cam_args);
// 	}
//
// 	// var material = new THREE.MeshLambertMaterial({
// 	// 	color: new THREE.Color(1, 0.5, 0.5),
// 	// 	wireframe: false
// 	// });
// 	//
// 	//
// 	// var geo = new THREE.SphereGeometry(0.6, 10, 10);
// 	// // var mesh = new THREE.Mesh(geo, material);
// 	// // mesh.position = new THREE.Vector3(1, 1, 1);
// 	// // console.log(mesh);
// 	//
// 	// var p = new THREE.Vector4(0, 0, 0);
// 	//
// 	// var c = new Sphere(geo, p, material);
// 	//
// 	// gl.addToScene(c.mesh);
// 	// // var shape = new shapeWrapper(0.3, 10);
// 	//
// 	// // var l = new Line();
// 	// // l.aliasV1(new THREE.Vector4(0, 0, 0, 0));
// 	// // l.aliasV2(new THREE.Vector4(1, 1, 1, 1));
// 	//
// 	// // var t = new Tube(shape, material, l);
// 	//
// 	// // gl.addToScene(.mesh);
// 	//
// 	// var animation = new Animation(1, 1, gl);
// 	// animation.startRender();
// 	// //
// 	// //
// 	// p.copy(new THREE.Vector4(1, 1, 1, 1));
// 	// c.updatePosition();
// 	// material.wireframe = true;
// 	//
// 	// c.mesh.position = new THREE.Vector4(1, 1, 1, 1);
// 	// // var x = c.mesh.position;
// 	// // x.set(1, 1, 1, 1);
// 	//
// 	// console.log(Object.isSealed(c.mesh.position));
// 	// console.log(Object.isFrozen(c.mesh.position));
//
//
// 	// console.log(c.mesh);
//
// 	// c.remakeGeo(new THREE.SphereGeometry(0.2, 4, 4));
// 	// c.mesh.position.sub(new THREE.Vector4)
// 	// c.aliasPosition(new THREE.Vector4(1, 1, 1, 1));
//
// 	// material.color = new THREE.Color(0.5, 0.5, 1);
// 	//
// 	// shape.updateShape(0.6, 10);
//
// 	// t.remakeGeo();
//
//
//
//
//
// 	// var a = new THREE.Vector4(0, 0, 0, 0);
// 	//
// 	// var b = new THREE.Vector4(1, 1, 1, 1);
// 	//
// 	// var c = new THREE.Vector4(2, 2, 2, 2);
// 	//
// 	// a = b
// 	// a.copy(c);
//
//
//
// 	// console.log(JSON.parse(JSON.stringify(a)));
// 	// console.log(JSON.parse(JSON.stringify(b)));
// 	// console.log(JSON.parse(JSON.stringify(c)));
//
// 	/*
// 	PROBLEM: It seems that if we establish that the v1 vector inside curve is aliased to an outside vector,
// 	and we REASSIGN the outside vector, the vector inside curve is not reassigned.
//
// 	in an assignment like
// 		a = b
// 	this tells js to have the name "a" point to the object pointed to by b.
// 	if we then do
// 		a = c
// 	a just now points to the c object. NOTHING happens to the object formerly pointed to by a.
// 	however, if we do
// 		a.copy(c)
// 	this operates on the object pointed to by a, so now a, b, and c point to the same thing.
// 	*/
//
// 	// var v = new THREE.Vector4(1, 2, 3, 4);
// 	// var vv = new THREE.Vector4(5, 6, 7, 8);
// 	// curve = new THREE.LineCurve3(v, null);
// 	// // v.set(5, 6, 7, 8);
// 	// v = vv;
// 	//
// 	// var c = curve;
//
// 	// console.log(c);
//
//
// 	// line = new Line(null, null);
// 	// var v = new THREE.Vector4(1, 2, 3, 4);
// 	// line.v1 = v;
// 	// console.log(line);
// 	// data = new Data();
// 	// data.initializeCube(initLines)
// 	//
// 	// data.points[0].set(2, 2, 2, 2);
// 	// data.ppoints[0].set(3, 3, 3, 3);
// 	// console.log(data);
// 	// console.log("Length" + l.getLength());
// 	// console.log(l.containsPoint(new THREE.Vector4(0, 0, 1, 0)));
//
// 	// l.getV1() = new THREE.Vector4(0, 1, 1, 1);
// 	// l.setV1(new THREE.Vector4(1, 1, 1, 1));
// 	// console.log(l.curve.v1);
// 	// console.log(l.equals(l2));
//
//
//
//
// 	// data.initializeCube(init_lines, init_points);
//
//
// 	// var graph
//
// 	// animation.startRender();
// 	//
// 	// var l = new Line(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1))
//
// }
