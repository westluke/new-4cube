var Matrix = new Object();

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
Matrix.rotateXY_4d = function (theta){
    return this.rotationMatrix4d([0, 1], theta);
}
Matrix.rotateYZ_4d = function (theta){
    return this.rotationMatrix4d([1, 2], theta);
}
Matrix.rotateZX_4d = function (theta){
    return this.rotationMatrix4d([2, 0], theta);
}
Matrix.rotateXW_4d = function (theta){
    return this.rotationMatrix4d([0, 3], theta);
}
Matrix.rotateWY_4d = function (theta){
    return this.rotationMatrix4d([3, 1], theta);
}
Matrix.rotateWZ_4d = function (theta){
    return this.rotationMatrix4d([3, 2], theta);
}
