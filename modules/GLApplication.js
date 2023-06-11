import * as STL from './STLFile.js'
import { VisibleObject } from './VisibleObject.js'
import { Color } from './Color.js'

export class GLApplication {
  canvas
  context
  visibleObjects
  shaderProgram
  backgroundColor

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

  async init () {
    

    const stlFile = new STL.STLFile(new URL('../assets/DeLorean.STL', window.document.baseURI))
    await stlFile.load()

    let shaderFile = await fetch('../assets/shaders/standard_vertexShader.glsl')

    if (shaderFile.status !== 200) { throw new Error('Cannot load shader file.') }

    const vShaderStr = await shaderFile.text()

    const vShader = this.context.createShader(this.context.VERTEX_SHADER)
    this.context.shaderSource(vShader, vShaderStr)
    this.context.compileShader(vShader)

    if (!this.context.getShaderParameter(vShader, this.context.COMPILE_STATUS)) {
      const log = this.context.getShaderInfoLog(vShader)
      this.context.deleteShader(vShader)

      throw new Error('An error occurred compiling the shaders: ' + log)
    }

    const shaderProgram = this.context.createProgram()
    this.context.attachShader(shaderProgram, vShader)

    shaderFile = await fetch('../assets/shaders/solidColor_fragShader.glsl')
    if (shaderFile.status !== 200) { throw new Error('Cannot load shader file.') }

    const solidColorShaderStr = await shaderFile.text()

    const solidColorShader = this.context.createShader(this.context.FRAGMENT_SHADER)
    this.context.shaderSource(solidColorShader, solidColorShaderStr)
    this.context.compileShader(solidColorShader)

    if (!this.context.getShaderParameter(solidColorShader, this.context.COMPILE_STATUS)) {
      const log = this.context.getShaderInfoLog(solidColorShader)
      this.context.deleteShader(solidColorShader)

      throw new Error('An error occurred compiling the shaders: ' + log)
    }

    this.context.attachShader(shaderProgram, solidColorShader)

    this.context.linkProgram(shaderProgram)

    if (!this.context.getProgramParameter(shaderProgram, this.context.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program: ' + this.context.getProgramInfoLog(shaderProgram))
    }

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.context.getAttribLocation(shaderProgram, 'position')
      },
      uniformLocations: {
        projectionMatrix: this.context.getUniformLocation(shaderProgram, 'projectionMatrix'),
        modelViewMatrix: this.context.getUniformLocation(shaderProgram, 'modelViewMatrix'),
        isProjected: this.context.getUniformLocation(shaderProgram, 'isProjected'),
        solidColor: this.context.getUniformLocation(shaderProgram, 'solidColor')
      }
    }

    this.context.useProgram(programInfo.program)

    this.context.deleteShader(vShader)
    this.context.deleteShader(solidColorShader)

    const vertexBuffer = this.context.createBuffer()
    this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexBuffer)

    const positionsTriangle = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(positionsTriangle), this.context.STATIC_DRAW)

    this.context.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, this.context.FLOAT, false, 0, 0)
    this.context.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)

    const modelViewMatrix = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]
    const projectionMatrix = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]

    this.context.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)
    this.context.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
    this.context.uniform1i(programInfo.uniformLocations.isProjected, true)
    this.context.uniform4f(programInfo.uniformLocations.solidColor, 1.0, 0.0, 0.0, 1.0)

    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, 4)

    this._render()
  }

  _render () {
    this.visibleObjects.forEach(element => {
      if (element instanceof VisibleObject) { element.render() }
    })
  }
}
