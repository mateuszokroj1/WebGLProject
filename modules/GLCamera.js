import * as GLM from 'gl-matrix'

export class GLCamera {
  angleOfView
  near
  far
  positionInWorld
  direction

  constructor (angleOfView, near, far, positionInWorld, direction) {
    if (angleOfView > 0.0 && near < far && near && positionInWorld instanceof GLM.vec3 && direction instanceof GLM.vec3) {
      this.angleOfView = angleOfView
      this.near = near
      this.far = far
      this.positionInWorld = positionInWorld
      this.direction = direction
    } else {
      throw new Error('Bad argument.')
    }
  }

  getViewMatrix () {
    const trafo = GLM.mat4.identity()

    GLM.mat4.rotateX(trafo, trafo, this.direction[0])
    GLM.mat4.rotateY(trafo, trafo, this.direction[1])
    GLM.mat4.rotateZ(trafo, trafo, this.direction[2])

    GLM.mat4.translate(trafo, trafo, this.positionInWorld)

    return trafo
  }

  getPerspectiveMatrix (aspect) {
    const trafo = GLM.mat4.identity()
    GLM.mat4.perspective(trafo, this.angleOfView, aspect, this.near, this.far)

    return trafo
  }
}
