import { IModel } from './abstracts/IModel.js'
import { GLCamera } from './GLCamera.js'
import { GLShaderProgram } from './GLShaderProgram.js'
import { Transformation } from './Transformation.js'
import * as GLM from '../node_modules/gl-matrix/esm/index.js'

export class VisibleObject {
  name
  color
  opacity
  model
  importTransformation
  transformation
  useProjection

  constructor (name) {
    if (typeof name === 'string') { this.name = name } else { throw new Error('Name is not a String.') }

    this.opacity = 1.0
    this.color = GLM.vec3.fromValues(0, 0, 0)
    this.model = null
    this.useProjection = false
    this.transformation = new Transformation()
    this.importTransformation = new Transformation()
  }

  render (context, shaderProgram, camera, aspect) {
    if (!(this.model instanceof IModel) || (typeof this.opacity !== 'number') || !(this.color instanceof Float32Array)) throw new Error('Bad configuration.')
    if (!(context instanceof WebGLRenderingContext) || !(shaderProgram instanceof GLShaderProgram) || !(camera instanceof GLCamera) || (typeof aspect !== 'number')) throw new Error('Bad argument.')

    const modelData = this.model.getVertices()

    const modelMatrix = this.importTransformation.calculateMatrix()
    GLM.mat4.multiply(modelMatrix, modelMatrix, this.transformation.calculateMatrix())

    shaderProgram.configureRendering(this.color, modelMatrix, camera.getViewMatrix(), true, this.useProjection, camera.getPerspectiveMatrix(aspect), GLM.vec3.fromValues(0.2, 0.2, 0.2), GLM.vec3.fromValues(1, 1, 1), GLM.vec3.fromValues(-0.71, 0.71, 0))
    shaderProgram.loadBuffers(modelData.vertices, modelData.normals)

    context.drawArrays(context.TRIANGLES, 0, modelData.vertices.length / 3)
  }
}
