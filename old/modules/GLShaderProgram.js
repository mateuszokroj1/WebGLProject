import * as GLM from '../node_modules/gl-matrix/esm/index.js'
import { VisibleObject } from './VisibleObject.js'

export class GLShaderProgram {
  context
  uniformLocations
  glShaderProgram
  positionAttribute
  vertexBuffer
  normalBuffer

  constructor(context) {
    if (context instanceof WebGLRenderingContext) {
      this.context = context
    } else {
      throw new Error('context is not WebGL Context type.')
    }
  }

  async load() {
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
      vertexPosition: this.context.getAttribLocation(this.glShaderProgram, 'a_position'),
      vertexNormal: this.context.getAttribLocation(this.glShaderProgram, 'a_normal')
    }
    this.uniformLocations = {
      ambientLightColor: this.context.getUniformLocation(this.glShaderProgram, 'u_ambientLight'),
      directionalLightColor: this.context.getUniformLocation(this.glShaderProgram, 'u_directionalLightColor'),
      directionalLightVector: this.context.getUniformLocation(this.glShaderProgram, 'u_directionalLightVector'),
      useLighting: this.context.getUniformLocation(this.glShaderProgram, 'u_useLighting'),
      isProjected: this.context.getUniformLocation(this.glShaderProgram, 'u_isProjected'),
      projectionMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_projectionMatrix'),
      modelMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_modelMatrix'),
      viewMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_viewMatrix'),
      basicColor: this.context.getUniformLocation(this.glShaderProgram, 'u_basicColor'),
      normalMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_normalMatrix'),
      lightDirectionMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_lightDirectionMatrix')
    }

    this.vertexBuffer = this.context.createBuffer()
    this.normalBuffer = this.context.createBuffer()
  }

  configureWorldParameters(viewMatrix, projectionMatrix, ambientLightColor, directionalLightColor, directionalLightVector) {
    this.context.uniform4fv(this.uniformLocations.ambientLightColor, ambientLightColor)
    this.context.uniform3fv(this.uniformLocations.directionalLightColor, directionalLightColor)
    this.context.uniform3fv(this.uniformLocations.directionalLightVector, directionalLightVector)
    this.context.uniformMatrix4fv(this.uniformLocations.viewMatrix, false, viewMatrix)
    this.context.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false, projectionMatrix)

    const lightDirectionMatrix = GLM.mat3.create()
    GLM.mat3.normalFromMat4(lightDirectionMatrix, viewMatrix)
    GLM.mat3.invert(lightDirectionMatrix, lightDirectionMatrix)
    GLM.mat3.transpose(lightDirectionMatrix, lightDirectionMatrix)

    this.context.uniformMatrix3fv(this.uniformLocations.lightDirectionMatrix, false, lightDirectionMatrix)
  }

  renderVisibleObject(object, viewMatrix) {
    if (!(object instanceof VisibleObject) || !(viewMatrix instanceof Float32Array)) throw new Error('Bad argument.')

    this.context.uniform4f(this.uniformLocations.basicColor, object.color[0], object.color[1], object.color[2], Math.max(0, Math.min(object.opacity, 1)))
    this.context.uniform1i(this.uniformLocations.useLighting, object.useLighting)
    this.context.uniform1i(this.uniformLocations.isProjected, object.useProjection)

    const modelMatrix = object.importTransformation.calculateMatrix()
    const m2 = object.transformation.calculateMatrix()
    GLM.mat4.multiply(modelMatrix, modelMatrix, m2)

    this.context.uniformMatrix4fv(this.uniformLocations.modelMatrix, false, modelMatrix)

    const normalMatrix4 = GLM.mat4.create()
    GLM.mat4.multiply(normalMatrix4, viewMatrix, modelMatrix)
    
    const normalMatrix = GLM.mat3.create()
    GLM.mat3.normalFromMat4(normalMatrix, normalMatrix4)
    GLM.mat3.invert(normalMatrix, normalMatrix)
    //GLM.mat3.transpose(normalMatrix, normalMatrix)

    this.context.uniformMatrix3fv(this.uniformLocations.normalMatrix, false, normalMatrix)

    this.context.enableVertexAttribArray(this.attribLocations.vertexPosition)
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer)
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(object.vertices), this.context.STATIC_DRAW)
    this.context.vertexAttribPointer(this.attribLocations.vertexPosition, 3, this.context.FLOAT, false, 0, 0)

    this.context.enableVertexAttribArray(this.attribLocations.vertexNormal)
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.normalBuffer)
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(object.normals), this.context.STATIC_DRAW)
    this.context.vertexAttribPointer(this.attribLocations.vertexNormal, 3, this.context.FLOAT, false, 0, 0)
  }
}
