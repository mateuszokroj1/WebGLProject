import { IModel } from './abstracts/IModel'

export class VisibleObject {
  name
  opacity
  model
  importTransformation
  transformation
  useProjection

  constructor (name) {
    if (name instanceof String) { this.name = name } else { throw new Error('Name is not a String.') }

    this.opacity = 1.0
    this.model = null
    this.useProjection = false
    this.transformation = 
  }

  render () {
    if (!(this.model instanceof IModel)) { return }

    const vertices = this.model.getVertices()
  }
}
