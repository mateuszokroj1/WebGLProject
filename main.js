import * as GLM from './node_modules/gl-matrix/esm/index.js'
import { GLApplication } from './modules/GLApplication.js'
import { STLFile } from './modules/STLFile.js'
import { GLCamera } from './modules/GLCamera.js'
import { VisibleObject } from './modules/VisibleObject.js'
import { GLShaderProgram } from './modules/GLShaderProgram.js'

const app = new GLApplication(window, 'canvas#screen')

const obj = new VisibleObject('car')

const stl = new STLFile(new URL('/assets/DeLorean.STL', window.document.baseURI))
await stl.load()
obj.model = stl
obj.opacity = 1.0
obj.color = GLM.vec3.fromValues(1, 0, 0)

app.visibleObjects.push(obj)

let shaderProgram = new GLShaderProgram(app.context)
await shaderProgram.load()

app.setShaderProgram(shaderProgram)
app.backgroundColor = GLM.vec3.fromValues(0.1, 0.1, 0.1)
app.camera = new GLCamera(90, 0.1, 1000.0, GLM.vec3.fromValues(0, -5, 0), GLM.vec3.fromValues(0, 1, 0))
app.preRender()
app.render()
