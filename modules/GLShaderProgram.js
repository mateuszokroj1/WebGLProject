export class GLShaderProgram {
  context
  uniformLocations
  glShaderProgram
  positionAttribute

  constructor (context) {
    if (context instanceof WebGLRenderingContext) {
      this.context = context
    } else {
      throw new Error('context is not WebGL Context type.')
    }
  }

  async load () {

  }
}
