export class IModel {
  constructor () {
    if (this.constructor === IModel) {
      throw new Error('Cannot use abstract class.')
    }
  }

  getVertices () {
    return []
  }
}
