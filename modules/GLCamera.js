import * as GLM from '../node_modules/gl-matrix/esm/index.js'

export class GLCamera {
  angleOfView
  near
  far
  positionInWorld
  rotation
  targetPosition

  lookAt(position) {
    if(position instanceof GLM.vec3)
    {
      this.targetPosition = position
    }
    else throw new Error("Required GLM vec3")
  }

  setView (angleOfView, near, far, positionInWorld, rotation) {
    if (angleOfView > 0.0 && near < far && near && positionInWorld instanceof Float32Array && positionInWorld.length === 3 && rotation instanceof Float32Array && rotation.length === 3) {
      this.angleOfView = angleOfView
      this.near = near
      this.far = far
      this.positionInWorld = positionInWorld
      this.rotation = rotation
    } else {
      throw new Error('Bad argument.')
    }
  }

  getViewMatrix () {
    const trafo = GLM.mat4.create()
    GLM.mat4.identity(trafo)

    GLM.mat4.rotateX(trafo, trafo, this.rotation[0])
    GLM.mat4.rotateY(trafo, trafo, this.rotation[1])
    GLM.mat4.rotateZ(trafo, trafo, this.rotation[2])

    GLM.mat4.translate(trafo, trafo, this.positionInWorld)

    return trafo
  }

  getPerspectiveMatrix (aspect) {
    const trafo = GLM.mat4.create()
    GLM.mat4.perspective(trafo, this.angleOfView, aspect, this.near, this.far)

    return trafo
  }
}
