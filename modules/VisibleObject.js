import { IModel } from './abstracts/IModel.js'
import { Transformation } from './Transformation.js'
import * as GLM from '../node_modules/gl-matrix/gl-matrix.js'

export class VisibleObject {
  name
  opacity
  model
  importTransformation
  transformation
  useProjection

  constructor (name) {
    if (name instanceof String) { this.name = name } else { throw new Error('Name is not a String.') }

    this.opacity = 1.0
    this.model = null
    this.useProjection = false
    this.transformation = new Transformation()
    this.importTransformation = new Transformation()
  }

  render (context, shaderProgram, camera) {
    if (!(this.model instanceof IModel)) { return }

    const vertices = this.model.getVertices()

    let trafo = this.importTransformation.calculateMatrix()
    GLM.mat4.mul(trafo, trafo, this.importTransformation.calculateMatrix())
    
  }
}
