import { VisibleObject } from './VisibleObject.js'
import { GLShaderProgram } from './GLShaderProgram.js'
import * as GLM from '../node_modules/gl-matrix/esm/index.js'

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
    this.backgroundColor = GLM.vec3.fromValues(0, 0, 0)
  }

  preRender () {
    this.context.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], 1)
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

  render () {
    this.visibleObjects.forEach(element => {
      if (element instanceof VisibleObject) { element.render(this.context, this.shaderProgram, this.camera, this.canvas.clientWidth / this.canvas.clientHeight) }
    })
  }
}
