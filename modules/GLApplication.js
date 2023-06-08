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
    this.context.clearDepth(1.0)
    this.context.enable(this.context.DEPTH_TEST)
    this.context.depthFunc(this.context.LEQUAL)
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT)

    const stlFile = new STL.STLFile(new URL('../assets/DeLorean.STL', window.document.baseURI))
    await stlFile.load()

    let shaderFile = await fetch('../assets/shaders/standard_vertexShader.txt')
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

    shaderFile = await fetch('../assets/shaders/solidColor_fragShader.txt')
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
        modelViewMatrix: this.context.getUniformLocation(shaderProgram, 'modelViewMatrix')
      }
    }

    this.context.useProgram(programInfo.program)

    

    this._render()
  }

  _render () {

  }
}
