import * as GLM from './node_modules/gl-matrix/esm/index.js'
import { GLApplication } from './modules/GLApplication.js'
import { GLCamera } from './modules/GLCamera.js'
import { VisibleObject } from './modules/VisibleObject.js'
import { GLShaderProgram } from './modules/GLShaderProgram.js'
import { TestCube } from './modules/TestCube.js'

class Game {
  app
  obj
  rotation
  mouseIsDown

  constructor () {
    this.app = new GLApplication(window, 'canvas#screen')
    this.obj = new VisibleObject('car')

    // const stl = new STLFile(new URL('/assets/DeLorean.STL', window.document.baseURI))
    // await stl.load()
    const model = new TestCube()
    this.obj.model = model
    this.obj.importTransformation.scale = GLM.vec3.fromValues(0.9, 0.9, 0.9)
    this.obj.useProjection = true
    this.obj.color = GLM.vec3.fromValues(1, 0, 0)
    this.rotation = GLM.vec3.fromValues(Math.PI / 4, Math.PI / 4, Math.PI / 4)
    this.obj.transformation.rotation_angles = this.rotation

    this.app.visibleObjects.push(this.obj)
  }

  async init () {
    const shaderProgram = new GLShaderProgram(this.app.context)
    await shaderProgram.load()

    this.app.backgroundColor = GLM.vec3.fromValues(0.1, 0.1, 0.1)
    this.app.camera = new GLCamera(Math.PI / 4, 0.1, 100.0, GLM.vec3.fromValues(0, 0, -6), GLM.vec3.fromValues(0, 0, 0))
    this.app.preRender()

    this.app.setShaderProgram(shaderProgram)
    this.app.render()
    window.document.addEventListener('mousedown', this.onMouseDown)
    window.document.addEventListener('mouseup', this.onMouseUp)
    window.document.addEventListener('mousemove', this.onMouseMove)
   // window.document.addEventListener('touchmove', (ev) => {})
    window.document.addEventListener('resize', this.render)
  }

  onMouseDown (ev) {
    if (ev instanceof MouseEvent && ev.button === 0) this.game.mouseIsDown = true
  }

  onMouseUp (ev) {
    if (ev instanceof MouseEvent && ev.button === 0) this.game.mouseIsDown = false
  }

  onMouseMove (ev) {
    if (this.game.mouseIsDown && ev instanceof MouseEvent) {
      this.game.rotateX(ev.movementY)

      if (ev.shiftKey) { this.game.rotateZ(ev.movementX) } else { this.game.rotateY(ev.movementX) }
    }
  }

  rotateY (offsetY) {
    GLM.vec3.add(this.rotation, this.rotation, GLM.vec3.fromValues(0, offsetY / 100, 0))
    this.obj.transformation.rotation_angles = this.rotation

    this.render()
  }

  rotateX (offsetX) {
    GLM.vec3.add(this.rotation, this.rotation, GLM.vec3.fromValues(offsetX / 100, 0, 0))
    this.obj.transformation.rotation_angles = this.rotation

    this.render()
  }

  rotateZ (offsetX) {
    GLM.vec3.add(this.rotation, this.rotation, GLM.vec3.fromValues(0, 0, offsetX / 100))
    this.obj.transformation.rotation_angles = this.rotation

    this.render()
  }

  render () {
    this.app.preRender()
    this.app.render()
  }
}

window.document.addEventListener('DOMContentLoaded', async function (obj, ev) { document.game = new Game(); await document.game.init() })
