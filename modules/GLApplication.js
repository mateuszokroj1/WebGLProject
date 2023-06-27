import * as STL from './STLFile.js'
import { VisibleObject } from './VisibleObject.js'
import { Color } from './Color.js'
import { GLShaderProgram } from './GLShaderProgram.js'

export class GLApplication {
  canvas
  context
  visibleObjects
  shaderProgram
  backgroundColor
  camera

  constructor (window, canvasSelector) {
    const element = window.document.querySelector(canvasSelector)

    if (element instanceof HTMLCanvasElement) { this.canvas = element } else { throw new Error('Unable to find canvas element for WebGL rendering.') }

    const context = this.canvas.getContext('webgl')
    if (context instanceof WebGLRenderingContext) { this.context = context } else { throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.') }

    this.visibleObjects = []
    this.backgroundColor = new Color(0, 0, 0, 1)
  }

  preRender () {
    this.context.clearColor(0.0, 0.0, 0.0, 1.0)
    this.context.clearDepth(1.0)
    this.context.enable(this.context.DEPTH_TEST)
    this.context.depthFunc(this.context.LEQUAL)
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT)
  }

  setShaderProgram (shaderProgram) {
    if (shaderProgram instanceof GLShaderProgram) {
      this.shaderProgram = shaderProgram
      this.context.useProgram(shaderProgram.glShaderProgram)
    } else { this.shaderProgram = null }
  }

  _render () {
    this.visibleObjects.forEach(element => {
      if (element instanceof VisibleObject) { element.render() }
    })
  }
}
