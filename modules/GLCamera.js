import * as GLM from '../node_modules/gl-matrix/esm/index.js'
import { VisibleObject } from './VisibleObject.js'

export class GLCamera {
  angleOfView = 90.0
  near = -10.0
  far = 100.0
  positionInWorld = GLM.vec3.fromValues(0,0,0)
  rotation_angles = GLM.vec3.fromValues(0,0,0)

  lookAt(object) {
    if(object instanceof VisibleObject)
    {
      this.targetPosition = position
    }
    else throw new Error("Required GLM vec3")

    this.positionInWorld = GLM.vec3.fromValues(0,0,0)
    const modelTrafo1 = object.importTransformation.calculateMatrix()
    const modelTrafo2 = object.transformation.calculateMatrix()
    GLM.vec3.transformMat4(this.positionInWorld, this.positionInWorld, modelTrafo1)
    GLM.vec3.transformMat4(this.positionInWorld, this.positionInWorld, modelTrafo2)
  }

  getViewMatrix (zoom) {
    if(!(typeof zoom !== 'number') || zoom <= 0)
    {
      throw new Error('Bad argument type or too low value.')
    }

    const trafo = GLM.mat4.create()
    GLM.mat4.identity(trafo)

    GLM.mat4.translate(trafo, trafo, this.positionInWorld)

    GLM.mat4.rotateZ(trafo, trafo, this.rotation_angles[2])
    GLM.mat4.rotateY(trafo, trafo, this.rotation_angles[1])
    GLM.mat4.rotateX(trafo, trafo, this.rotation_angles[0])

    const camOffset = GLM.vec3.fromValues(0, 0, -10 * zoom)
    GLM.mat4.translate(trafo, trafo, camOffset)

    GLM.mat4.invert(trafo, trafo)

    return trafo
  }


  getOrthoMatrix() {
    const trafo = GLM.mat4.create()
    GLM.mat4.ortho(trafo, this.near, this.far, this.near, this.far, this.near, this.far)

    return trafo
  }

  getPerspectiveMatrix (aspect) {
    const trafo = GLM.mat4.create()
    GLM.mat4.perspective(trafo, this.angleOfView, aspect, this.near, this.far)

    return trafo
  }
}
