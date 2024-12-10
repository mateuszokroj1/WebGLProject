import * as GLM from '../../node_modules/gl-matrix/esm/index.js'

export class IModel {
  constructor () {
    if (this.constructor === IModel) {
      throw new Error('Cannot use abstract class.')
    }
  }

  getVertices () {
    return {
      vertices: new Float32Array(0),
      normals: new Float32Array(0)
    }
  }

  calcBoundingBox() {
    return {
      min: GLM.vec3.fromValues(0,0,0),
      max: GLM.vec3.fromValues(0,0,0),
      center: GLM.vec3.fromValues(0,0,0)
    }
  }
}
