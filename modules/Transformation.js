import * as GLM from '../node_modules/gl-matrix/esm/index.js'

export class Transformation {
  position = GLM.vec3.fromValues(0, 0, 0)
  rotation_angles = GLM.vec3.fromValues(0, 0, 0)
  scale = GLM.vec3.fromValues(1.0, 1.0, 1.0)
  rotation_anchorPoint = GLM.vec3.fromValues(0, 0, 0)

  calculateMatrix () {
    const trafo = GLM.mat4.create()
    GLM.mat4.identity(trafo)
    GLM.mat4.scale(trafo, trafo, this.scale)

    GLM.mat4.translate(trafo, trafo, this.rotation_anchorPoint)

    GLM.mat4.rotateZ(trafo, trafo, this.rotation_angles[2])
    GLM.mat4.rotateY(trafo, trafo, this.rotation_angles[1])
    GLM.mat4.rotateX(trafo, trafo, this.rotation_angles[0])

    const negated_anchor_point = GLM.vec3.create()
    GLM.vec3.negate(negated_anchor_point, this.rotation_anchorPoint)
    GLM.mat4.translate(trafo, trafo, negated_anchor_point)

    GLM.mat4.translate(trafo, trafo, this.position)
    
    return trafo
  }
}
