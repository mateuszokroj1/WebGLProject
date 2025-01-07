import { VisibleObject } from './VisibleObject.js'
import { GLShaderProgram } from './GLShaderProgram.js'
import * as GLM from '../node_modules/gl-matrix/esm/index.js'
import { GLCamera } from './GLCamera.js'

export class GLApplication {
  canvas = null
  context = null
  visibleObjects = []
  shaderProgram = null
  backgroundColor = GLM.vec2.fromValues(0,0,0)
  camera = new GLCamera

  constructor(window, canvasSelector) {
    const element = window.document.querySelector(canvasSelector)

    if (element instanceof HTMLCanvasElement) { this.canvas = element } else { throw new Error('Unable to find canvas element for WebGL rendering.') }

    const context = this.canvas.getContext('webgl')
    if (context instanceof WebGLRenderingContext) { this.context = context } else { throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.') }
  }

  preRender() {
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT | this.context.STENCIL_BUFFER_BIT)
    this.context.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], 1)
    this.context.clearDepth(1.0)

    //this.context.enable(this.context.CULL_FACE)
    //this.context.cullFace(this.context.FRONT)

    this.context.enable(this.context.DEPTH_TEST)
    this.context.depthFunc(this.context.LEQUAL)

    this.context.enable(this.context.BLEND)
    this.context.blendFunc(this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA)

    this.context.viewport(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)
  }

  setShaderProgram(shaderProgram) {
    if (shaderProgram instanceof GLShaderProgram) {
      this.shaderProgram = shaderProgram
      this.context.useProgram(shaderProgram.glShaderProgram)
    } else { this.shaderProgram = null }
  }

  render() {
    const viewMatrix = this.camera.getViewMatrix()
    this.shaderProgram.configureWorldParameters(viewMatrix, this.camera.getOrthoMatrix() /*this.camera.getPerspectiveMatrix()*/, GLM.vec4.fromValues(1, 1, 1, 0.2), GLM.vec3.fromValues(1, 1, 1), GLM.vec3.fromValues(0.58, 0.58, -0.58))

    this.visibleObjects.forEach(element => {
      if (element instanceof VisibleObject) {
        this.shaderProgram.renderVisibleObject(element, viewMatrix)

        this.context.drawArrays(this.context.TRIANGLES, 0, (element.model.vertices.length | 0) / 3)
      }
    })
  }
}
