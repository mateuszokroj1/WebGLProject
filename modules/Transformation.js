import * as GLM from '../node_modules/gl-matrix/gl-matrix.js'

export class Transformation {
  position = [0.0, 0.0, 0.0]
  rotation_angles = [0.0, 0.0, 0.0]
  scale = [1.0, 1.0, 1.0]
  rotation_anchorPoint = [0.0, 0.0, 0.0]

  calculateMatrix () {
    let scaleAndTranslate = GLM.mat4.fromValues(this.scale[0], 0, 0, this.position[0], 0, this.scale[1], 0, this.position[1], 0, 0, this.scale[2], this.position[2], 0, 0, 0, 1)

    const preRotate = GLM.mat4.fromValues(0, 0, 0, this.rotation_anchorPoint[0], 0, 0, 0, this.rotation_anchorPoint[1], 0, 0, 0, this.rotation_anchorPoint[2], 0, 0, 0, 1)

    const rotateX = GLM.mat4.fromValues(1, 0, 0, 0, 0, Math.cos(this.rotation_angles[0]), -Math.sin(this.rotation_angles[0]), 0, 0, Math.sin(this.rotation_angles[0]), Math.cos(this.rotation_angles[0]), 0, 0, 0, 0, 1)
    const rotateY = GLM.mat4.fromValues(Math.cos(this.rotation_angles[1]), 0, Math.sin(), 0, 0, 1, 0, 0, -Math.sin(), 0, Math.cos(), 0, 0, 0, 0, 1)
    const rotateZ = GLM.mat4.fromValues(Math.cos(this.rotation_angles[2]), -Math.sin(this.rotation_angles[2]), 0, 0, Math.sin(this.rotation_angles[2]), Math.cos(this.rotation_angles[2]), 0, 0, 0, 0, 0, 0, 0, 0, 0, 1)

    const postRotate = GLM.mat4.fromValues(0, 0, 0, -this.rotation_anchorPoint[0], 0, 0, 0, -this.rotation_anchorPoint[1], 0, 0, 0, -this.rotation_anchorPoint[2], 0, 0, 0, 1)

    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, preRotate)
    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, rotateX)
    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, rotateY)
    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, rotateZ)
    GLM.mat4.multiply(scaleAndTranslate, scaleAndTranslate, postRotate)

    return scaleAndTranslate
  }
}
