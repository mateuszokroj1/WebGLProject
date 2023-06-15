import * as GLM from 'gl-matrix'

export function multiplyMatrices (m1, m2) {
  if (!(m1 instanceof Array) || !(m2 instanceof Array)) {
    throw new Error('Argument is not Array.')
  }

  if (m1.length !== 16 || m2.length !== 16) {
    throw new Error('Matrices is too small.')
  }

  let result = []

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
        result[row * 4 + column] = 
    }
  }
}

export class Transformation {
  position = [0.0, 0.0, 0.0]
  rotation_angles = [0.0, 0.0, 0.0]
  scale = [1.0, 1.0, 1.0]
  rotation_anchorPoint = [0.0, 0.0, 0.0]

  calculateMatrix () {
    let scaleAndTranslate = GLM.mat4.fromValues(this.scale[0], 0, 0, this.position[0], 0, this.scale[1], 0, this.position[1], 0, 0, this.scale[2], this.position[2], 0, 0, 0, 1)

    const preRotate = GLM.mat4.fromValues(0, 0, 0, this.rotation_anchorPoint[0], 0, 0, 0, this.rotation_anchorPoint[1], 0, 0, 0, this.rotation_anchorPoint[2], 0, 0, 0, 1)

    const rotateX = GLM.mat4.fromValues(1, 0, 0, 0, 0, cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1)
    const rotateY = GLM.mat4.fromValues(cos, 0, sin, 0, 0, 1, 0, 0, -sin, 0, cos, 0, 0, 0, 0, 1)
    const rotateZ = GLM.mat4.fromValues(cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1)

    const postRotate = GLM.mat4.fromValues(0, 0, 0, -this.rotation_anchorPoint[0], 0, 0, 0, -this.rotation_anchorPoint[1], 0, 0, 0, -this.rotation_anchorPoint[2], 0, 0, 0, 1)

    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, preRotate)
    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, rotateX)
    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, rotateY)
    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, rotateZ)
    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, postRotate)

    return scaleAndTranslate
  }
}
