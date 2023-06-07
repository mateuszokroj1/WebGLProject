import * as STL from './STLFile.js'

export class GLApplication {
  canvas
  context

  constructor (window, canvasSelector) {
    const element = window.document.querySelector(canvasSelector)

    if (element instanceof HTMLCanvasElement) { this.canvas = element } else { throw new Error('Unable to find canvas element for WebGL rendering.') }

    const context = this.canvas.getContext('webgl')
    if (context instanceof WebGLRenderingContext) { this.context = context } else { throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.') }
  }

  async init () {
    this.context.clearColor(20, 20, 20, 255)
    this.context.clear(this.context.COLOR_BUFFER_BIT)

    const stlFile = new STL.STLFile(new URL('../assets/DeLorean.STL', window.document.baseURI))
    await stlFile.load()

    this._render()
  }

  _render () {

  }
}
