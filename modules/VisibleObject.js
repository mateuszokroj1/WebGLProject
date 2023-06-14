export class VisibleObject {
  name
  opacity
  model

  constructor (name) {
    if (name instanceof String) { this.name = name } else { throw new Error('Name is not a String.') }

    this.opacity = 1.0
    this.model = null
  }

  render() {
    if (!(this.model instanceof IModel))
        return
  }
}
