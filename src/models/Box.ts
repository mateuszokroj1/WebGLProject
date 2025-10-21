import * as GLM from "gl-matrix";

export default class Box {
    private _min: GLM.vec3;
    private _max: GLM.vec3;

    constructor(min: GLM.vec3 = GLM.vec3.fromValues(NaN, NaN, NaN), max: GLM.vec3 = GLM.vec3.fromValues(NaN, NaN, NaN)) {
        this._min = min;
        this._max = max;

        if (!isNaN(min[0]) && !isNaN(min[1]) && !isNaN(min[2]) && !isNaN(max[0]) && !isNaN(max[1]) && !isNaN(max[2])) {
            const difference = GLM.vec3.create();
            GLM.vec3.subtract(difference, max, min);

            if (difference[0] < 0 || difference[1] < 0 || difference[2] < 0) {
                throw new Error("Invalid box dimensions: max must be greater than or equal to min in all dimensions.");
            }
        }
    }

    get min(): GLM.vec3 {
        return this._min;
    }

    get max(): GLM.vec3 {
        return this._max;
    }

    get center(): GLM.vec3 {
        const center = GLM.vec3.create();
        GLM.vec3.add(center, this._min, this._max);
        GLM.vec3.scale(center, center, 0.5);
        return center;
    }

    addPoint(point: GLM.vec3): void {
        for (let i = 0; i < 3; i++) {
            if (isNaN(this._min[i]) || isNaN(this._max[i])) {
                this._min[i] = point[i];
                this._max[i] = point[i];
                continue;
            }

            if (point[i] < this._min[i]) {
                this._min[i] = point[i];
            }

            if (point[i] > this._max[i]) {
                this._max[i] = point[i];
            }
        }
    }
}