import * as GLM from '../node_modules/gl-matrix/esm/index.js'

export class GLShaderProgram {
  context
  uniformLocations
  glShaderProgram
  positionAttribute
  vertexBuffer
  normalBuffer

  constructor (context) {
    if (context instanceof WebGLRenderingContext) {
      this.context = context
    } else {
      throw new Error('context is not WebGL Context type.')
    }
  }

  async load () {
    let shaderFile = await fetch('../assets/shaders/vertexShader.glsl')

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

    this.glShaderProgram = this.context.createProgram()
    this.context.attachShader(this.glShaderProgram, vShader)

    shaderFile = await fetch('../assets/shaders/fragShader.glsl')
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

    this.context.attachShader(this.glShaderProgram, solidColorShader)

    this.context.linkProgram(this.glShaderProgram)

    if (!this.context.getProgramParameter(this.glShaderProgram, this.context.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program: ' + this.context.getProgramInfoLog(this.glShaderProgram))
    }

    this.attribLocations = {
      vertexPosition: this.context.getAttribLocation(this.glShaderProgram, 'position'),
      vertexNormal: this.context.getAttribLocation(this.glShaderProgram, 'normal')
    }
    this.uniformLocations = {
      ambientLightColor: this.context.getUniformLocation(this.glShaderProgram, 'ambientLight'),
      directionalLightColor: this.context.getUniformLocation(this.glShaderProgram, 'directionalLightColor'),
      directionalLightVector: this.context.getUniformLocation(this.glShaderProgram, 'directionalLightVector'),
      useLighting: this.context.getUniformLocation(this.glShaderProgram, 'useLighting'),
      isProjected: this.context.getUniformLocation(this.glShaderProgram, 'isProjected'),
      normalMatrix: this.context.getUniformLocation(this.glShaderProgram, 'normalMatrix'),
      projectionMatrix: this.context.getUniformLocation(this.glShaderProgram, 'projectionMatrix'),
      modelMatrix: this.context.getUniformLocation(this.glShaderProgram, 'modelMatrix'),
      viewMatrix: this.context.getUniformLocation(this.glShaderProgram, 'viewMatrix'),
      basicColor: this.context.getUniformLocation(this.glShaderProgram, 'basicColor')
    }

    this.vertexBuffer = this.context.createBuffer()
    this.normalBuffer = this.context.createBuffer()
  }

  configureRendering (basicColor, modelMatrix, viewMatrix, useLighting, isProjected, projectionMatrix, ambientLightColor, directionalLightColor, directionalLightVector) {
    this.context.uniform3fv(this.uniformLocations.ambientLightColor, ambientLightColor)
    this.context.uniform3fv(this.uniformLocations.directionalLightColor, directionalLightColor)
    this.context.uniform3fv(this.uniformLocations.directionalLightVector, directionalLightVector)
    this.context.uniform1i(this.uniformLocations.useLighting, useLighting)
    this.context.uniform1i(this.uniformLocations.isProjected, isProjected)
    this.context.uniformMatrix4fv(this.uniformLocations.modelMatrix, false, modelMatrix)
    this.context.uniformMatrix4fv(this.uniformLocations.viewMatrix, false, viewMatrix)
    this.context.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false, projectionMatrix)
    this.context.uniform3f(this.uniformLocations.basicColor, basicColor[0], basicColor[1], basicColor[2])

    const normalMatrix = GLM.mat4.create()
    GLM.mat4.multiply(normalMatrix, viewMatrix, modelMatrix)
    GLM.mat4.invert(normalMatrix, normalMatrix)
    GLM.mat4.transpose(normalMatrix, normalMatrix)

    this.context.uniformMatrix4fv(this.uniformLocations.normalMatrix, false, normalMatrix)
  }

  loadBuffers (positions, normals) {
    if (!(positions instanceof Array) || !(normals instanceof Array)) throw new Error('Bad argument.')

    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer)
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(positions), this.context.STATIC_DRAW)

    this.context.vertexAttribPointer(this.attribLocations.vertexPosition, 3, this.context.FLOAT, false, 0, 0)
    this.context.enableVertexAttribArray(this.attribLocations.vertexPosition)

    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.normalBuffer)
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(normals), this.context.STATIC_DRAW)

    this.context.vertexAttribPointer(this.attribLocations.vertexNormal, 3, this.context.FLOAT, false, 0, 0)
    this.context.enableVertexAttribArray(this.attribLocations.vertexNormal)
  }
}
