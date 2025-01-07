import * as GLM from '../node_modules/gl-matrix/esm/index.js'

export class Box3d {
  min = GLM.vec3.fromValues(0, 0, 0)
  max = GLM.vec3.fromValues(0, 0, 0)
  translation = GLM.vec3.fromValues(0, 0, 0)
  scaler = 1.0

  calculateCenter() {
    let point = GLM.vec3.create()
    GLM.vec3.sub(point, this.max, this.min)
    GLM.vec3.scale(point, point, 0.5)

    return point
  }

  translateCenterToZero() {
    let middle = this.calculateCenter()
    GLM.vec3.copy(this.translation, middle)
    GLM.vec3.inverse(this.translation, this.translation)

    GLM.vec3.add(this.min, this.min, this.translation)
    GLM.vec3.add(this.max, this.max, this.translation)
  }

  calculateScalingTo(maxAbsoluteValue) {
    if (typeof maxAbsoluteValue != 'number' || maxAbsoluteValue <= 0) {
      throw new Error('Bad argument.')
    }

    let v1 = Math.min(Math.abs(this.min), maxAbsoluteValue)
    let v2 = Math.min(Math.abs(this.max), maxAbsoluteValue)
    let maxValue = Math.max(v1, v2)

    this.scaler = maxValue !== 0 ? maxAbsoluteValue / maxValue : 1.0
  }

  add(point) {
    if (!(point instanceof Float32Array) || point.length != 3) {
      throw new Error('Bad argument.')
    }

    for (let i = 0; i < 3; ++i) {
      if (point[i] < this.min[i])
        this.min[i] = point[i]

      if (point[i] > this.max[i])
        this.max[i] = point[i]
    }
  }
}