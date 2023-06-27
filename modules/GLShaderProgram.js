import * as GLM from 'gl-matrix'

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
  }

  configureRendering (basicColor, modelMatrix, viewMatrix, useLighting, isProjected, projectionMatrix, ambientLightColor, directionalLightColor, directionalLightVector) {
    this.context.vertexAttribPointer(this.attribLocations.vertexPosition, 4, this.context.FLOAT, false, 8, 0)
    this.context.enableVertexAttribArray(this.attribLocations.vertexPosition)

    this.context.vertexAttribPointer(this.attribLocations.vertexNormal, 4, this.context.FLOAT, false, 8, 4)
    this.context.enableVertexAttribArray(this.attribLocations.vertexNormal)

    this.context.uniform4fv(this.uniformLocations.ambientLightColor, ambientLightColor)
    this.context.uniform4fv(this.uniformLocations.directionalLightColor, directionalLightColor)
    this.context.uniform4fv(this.uniformLocations.directionalLightVector, directionalLightVector)
    this.context.uniform1i(this.uniformLocations.useLighting, useLighting)
    this.context.uniform1i(this.uniformLocations.isProjected, isProjected)
    this.context.uniformMatrix4fv(this.uniformLocations.modelMatrix, modelMatrix)
    this.context.uniformMatrix4fv(this.uniformLocations.viewMatrix, viewMatrix)
    this.context.uniformMatrix4fv(this.uniformLocations.projectionMatrix, projectionMatrix)
    this.context.uniform4fv(this.uniformLocations.basicColor, basicColor)
    this.context.uniformMatrix4fv(this.uniformLocations.normalMatrix, GLM.mat4.invert(viewMatrix * modelMatrix))
  }
}
