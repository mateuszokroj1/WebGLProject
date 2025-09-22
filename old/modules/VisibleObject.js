import * as GLM from '../node_modules/gl-matrix/esm/index.js'

import { IModel } from './abstracts/IModel.js'
import { GLCamera } from './GLCamera.js'
import { GLShaderProgram } from './GLShaderProgram.js'
import { Transformation } from './Transformation.js'
import { Box3d } from './Box3d.js'

export class VisibleObject {
  name = ''
  color = GLM.vec3.fromValues(0,0,0)
  opacity = 1
  model = null
  importTransformation = new Transformation()
  transformation = new Transformation()
  useProjection = true

  constructor (name) {
    if (typeof name === 'string') { this.name = name } else { throw new Error('Name is not a String.') }
  }

  setModel(model) {
      if(model instanceof IModel) {
        this.model = model

        const modelBox = model.getBoundingBox()

        this.importTransformation.position = modelBox.translation
        this.importTransformation.scale = GLM.vec3.fromValues(modelBox.scaler, modelBox.scaler, modelBox.scaler)            
      }
      else
      throw new Error('Bad argument.')
  }
}
