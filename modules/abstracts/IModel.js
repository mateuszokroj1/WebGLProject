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
}
