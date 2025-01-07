import { Box3d } from '../Box3d.js'

export class IModel {
  vertices = []
  normals = []

  constructor () {
    if (this.constructor === IModel) {
      throw new Error('Cannot use abstract class.')
    }
  }

  boundingBox = null
}
