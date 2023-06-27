import * as GLM from 'gl-matrix'
import { GLApplication } from './modules/GLApplication.js'
import { STLFile } from './modules/STLFile.js'
import { GLCamera } from './modules/GLCamera.js'
import { VisibleObject } from './modules/VisibleObject.js'
import { GLShaderProgram } from './modules/GLShaderProgram.js'

const app = new GLApplication(window, 'canvas#screen')

const obj = new VisibleObject('car')

const stl = new STLFile('/assets/DeLorean.STL')
await stl.load()
obj.model = stl

app.visibleObjects.push(obj)

app.setShaderProgram(new GLShaderProgram(app.context))
app.backgroundColor = GLM.vec3.fromValues(0.1, 0.1, 0.1)
app.camera = new GLCamera(90, 0.1, 1000.0, GLM.vec3.fromValues(0, -5, 0), GLM.vec3.fromValues(0, 0, 0))
app.preRender()
