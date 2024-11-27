import * as GLM from '../node_modules/gl-matrix/esm/index.js'

export class VectorsRange {
    min
    max

    constructor (min, max) {
        if (min instanceof GLM.vec3 && max instanceof GLM.vec3) {
            this.min = min
            this.max = max
         } else { throw new Error('Unknown value type.') }
      }

      center() {
        let point = GLM.vec3.create()
        GLM.vec3.add(point, min, max)
        GLM.vec3.scale(point, point, 0.5)
        
        return point
      }
}