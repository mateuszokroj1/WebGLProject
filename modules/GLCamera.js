import * as GLM from '../node_modules/gl-matrix/esm/index.js'

export class GLCamera {
  angleOfView
  near
  far
  positionInWorld
  direction

  constructor (angleOfView, near, far, positionInWorld, direction) {
    if (angleOfView > 0.0 && near < far && near && positionInWorld instanceof Float32Array && positionInWorld.length === 3 && direction instanceof Float32Array && direction.length === 3) {
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
    const trafo = GLM.mat4.create()
    GLM.mat4.identity(trafo)

    GLM.vec3.normalize(this.direction, this.direction)

    GLM.mat4.rotateX(trafo, trafo, this.direction[0])
    GLM.mat4.rotateY(trafo, trafo, this.direction[1])
    GLM.mat4.rotateZ(trafo, trafo, this.direction[2])

    GLM.mat4.translate(trafo, trafo, this.positionInWorld)

    return trafo
  }

  getPerspectiveMatrix (aspect) {
    const trafo = GLM.mat4.create()
    GLM.mat4.perspective(trafo, this.angleOfView, aspect, this.near, this.far)

    return trafo
  }
}
