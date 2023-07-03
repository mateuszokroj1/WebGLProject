import * as GLM from './node_modules/gl-matrix/esm/index.js'
import { GLApplication } from './modules/GLApplication.js'
import { STLFile } from './modules/STLFile.js'
import { GLCamera } from './modules/GLCamera.js'
import { VisibleObject } from './modules/VisibleObject.js'
import { GLShaderProgram } from './modules/GLShaderProgram.js'
import { TestCube } from './modules/TestCube.js'

const app = new GLApplication(window, 'canvas#screen')

const obj = new VisibleObject('car')

//const stl = new STLFile(new URL('/assets/DeLorean.STL', window.document.baseURI))
//await stl.load()
const model = new TestCube()
obj.model = model
obj.importTransformation.scale = GLM.vec3.fromValues(0.9, 0.9, 0.9)
obj.transformation.rotation_angles = GLM.vec3.fromValues(Math.PI/4, Math.PI/4, Math.PI/4)
obj.useProjection = true
obj.color = GLM.vec3.fromValues(1, 0, 0)

app.visibleObjects.push(obj)

let shaderProgram = new GLShaderProgram(app.context)
await shaderProgram.load()

app.backgroundColor = GLM.vec3.fromValues(0.1, 0.1, 0.1)
app.camera = new GLCamera(Math.PI / 4, 0.1, 100.0, GLM.vec3.fromValues(0, 0, -6), GLM.vec3.fromValues(0, 0, 0))
app.preRender()

app.setShaderProgram(shaderProgram)
app.render()
