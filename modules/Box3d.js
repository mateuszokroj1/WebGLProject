import * as GLM from 'gl-matrix/esm/index.js'

export class Box3d {
    min
    max
    translation

    constructor () {
        this.min = GLM.vec3.fromValues(0,0,0)
        this.max = GLM.vec3.fromValues(0,0,0)
        this.translation = GLM.vec3.fromValues(0,0,0)
      }

      calculateCenter() {
        let point = GLM.vec3.create()
        GLM.vec3.sub(point, max, min)
        GLM.vec3.scale(point, point, 0.5)
        
        return point
      }

      translateCenterToZero() {
        let middle = this.calculateCenter()
        GLM.vec3.copy(this.translation, middle)
        GLM.vec3.inverse(this.translation)

        GLM.vec3.add(this.min, this.min, this.translation)
        GLM.vec3.add(this.max, this.max, this.translation)
      }

      add(point) {
        if(!(point instanceof GLM.vec3))
        {
          throw new Error('Bad argument.')
        }

        for(let i = 0; i < 3; ++i) {
          if(point[i] < this.min[i])
            this.min[i] = point[i]

          if(point[i] > this.max[i])
            this.max[i] = point[i]
        }
      }
}