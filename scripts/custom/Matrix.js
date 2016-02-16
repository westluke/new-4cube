var Matrix = {};

Matrix.rotationMatrix4d = function (axes, theta){
    // Builds rotation matrices for the rotate.._4d functions.
    var m = new THREE.Matrix4();
    m.elements[axes[0]*4 + axes[0]] = Math.cos(theta);
    m.elements[axes[1]*4 + axes[1]] = Math.cos(theta);
    m.elements[axes[0]*4 + axes[1]] = -Math.sin(theta);
    m.elements[axes[1]*4 + axes[0]] = Math.sin(theta);
    return m;
}

// Rotation functions that produce transformation matrices
Matrix.xy = function (theta){
    return Matrix.rotationMatrix4d([0, 1], theta);
}

Matrix.yz = function (theta){
    return Matrix.rotationMatrix4d([1, 2], theta);
}

Matrix.zx = function (theta){
    return Matrix.rotationMatrix4d([2, 0], theta);
}

Matrix.xw = function (theta){
    return Matrix.rotationMatrix4d([0, 3], theta);
}

Matrix.wy = function (theta){
    return Matrix.rotationMatrix4d([3, 1], theta);
}

Matrix.wz = function (theta){
    return Matrix.rotationMatrix4d([3, 2], theta);
}
