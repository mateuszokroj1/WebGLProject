import { IModel } from './abstracts/IModel.js'
import { GLCamera } from './GLCamera.js'
import { GLShaderProgram } from './GLShaderProgram.js'
import { Transformation } from './Transformation.js'
import * as GLM from '../node_modules/gl-matrix/gl-matrix.js'

export class VisibleObject {
  name
  color
  opacity
  model
  importTransformation
  transformation
  useProjection

  constructor (name) {
    if (name instanceof String) { this.name = name } else { throw new Error('Name is not a String.') }

    this.opacity = 1.0
    this.color = GLM.vec3.fromValues(0, 0, 0)
    this.model = null
    this.useProjection = false
    this.transformation = new Transformation()
    this.importTransformation = new Transformation()
  }

  render (context, shaderProgram, camera) {
    if (!(this.model instanceof IModel) || !(shaderProgram instanceof GLShaderProgram) || !(camera instanceof GLCamera)) { return }

    const vertices = this.model.vertices

    const vertexBuffer = this.context.createBuffer()
    this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexBuffer)

    this.context.bufferData(this.context.ARRAY_BUFFER, vertices, this.context.STATIC_DRAW)

    let modelMatrix = this.importTransformation.calculateMatrix()
    GLM.mat4.mul(modelMatrix, modelMatrix, this.transformation.calculateMatrix())

    shaderProgram.configureRendering(this.color, modelMatrix, camera.getViewMatrix(), false, this.useProjection, camera.getPerspectiveMatrix(), GLM.vec4.fromValues(1, 1, 1, 1), GLM.vec4.fromValues(1, 1, 1, 1), GLM.vec4.fromValues(0, 1, 0, 0))

    this.context.drawArrays(this.context.TRIANGLES, 0, Math.floor(vertices.length / 4))
  }
}
