import { EPSILON } from 'gl-matrix/esm/common.js'
import * as GLM from '../node_modules/gl-matrix/esm/index.js'
import {IModel} from 'abstracts/IModel.js'

export class GLCamera {
  angleOfView
  near
  far
  positionInWorld
  direction

  constructor() {
    this.angleOfView = 0.0
    this.near = 0.0
    this.far = 0.0
    this.positionInWorld
  }

  lookAt(object) {
    if(object instanceof IModel)
    {
      this.targetPosition = position
    }
    else throw new Error("Required GLM vec3")
  }

  setView (angleOfView, near, far) {
    if (angleOfView > 0.0 && near < far && near) {
      this.angleOfView = angleOfView
      this.near = near
      this.far = far
    } else {
      throw new Error('Bad argument.')
    }
  }

  getViewMatrix (rotate, zoom) {
    if(!(rotate instanceof GLM.vec3) || typeof zoom === 'number' && zoom > EPSILON)
    {
      throw new Error('Bad argument.')
    }

    const trafo = GLM.mat4.create()
    GLM.mat4.identity(trafo)

    GLM.mat4.rotateX(trafo, trafo, this.rotation[0])
    GLM.mat4.rotateY(trafo, trafo, this.rotation[1])
    GLM.mat4.rotateZ(trafo, trafo, this.rotation[2])

    GLM.mat4.translate(trafo, trafo, this.positionInWorld)

    return trafo
  }

  getPerspectiveMatrix (angleOfView, near, far, aspect) {
    const trafo = GLM.mat4.create()
    GLM.mat4.perspective(trafo, this.angleOfView, aspect, this.near, this.far)

    return trafo
  }
}
