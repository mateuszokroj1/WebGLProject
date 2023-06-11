export class VisibleObject {
  name
  opacity

  constructor (name) {
    if (name instanceof String) { this.name = name } else { throw new Error('Name is not a String.') }

    this.opacity = 1.0
  }

  render () {

  }
}
