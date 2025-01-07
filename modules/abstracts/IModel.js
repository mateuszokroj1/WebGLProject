import * as GLM from '../../node_modules/gl-matrix/esm/index.js'
import {Box3d} from '../Box3d.js'

export class IModel {
  constructor () {
    if (this.constructor === IModel) {
      throw new Error('Cannot use abstract class.')
    }

    this.boundingBox = new Box3d()
  }

  boundingBox

  getVertices () {
    return {
      vertices: new Float32Array(0),
      normals: new Float32Array(0)
    }
  }
}
