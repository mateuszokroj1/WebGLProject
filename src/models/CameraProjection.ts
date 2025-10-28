import * as GLM from 'gl-matrix';
import ICameraProjection from '../interfaces/ICameraProjection';

export abstract class CameraProjectionBase implements ICameraProjection {
    public near: number = 0.1;
    public far: number = 1000;
    private _aspect: number = 1;

    get aspect(): number {
        return this._aspect;
    }

    set aspect(value: number) {
        if (value <= 0)
            throw new RangeError("Aspect ratio must be greater than 0");
        this._aspect = value;
    }

    abstract getProjectionMatrix(): GLM.mat4;
}

export class OrthoProjection extends CameraProjectionBase {
    public right: number = 5;

    getProjectionMatrix(): GLM.mat4 {
        let matrix = GLM.mat4.create();
        GLM.mat4.ortho(matrix, -5, this.right, -this.right / this.aspect, this.right / this.aspect, this.near, this.far);
        return matrix;
    }
}

export class PerspectiveProjection extends CameraProjectionBase {
    private _fov: number = 45;

    get fov(): number {
        return this._fov;
    }

    set fov(value: number) {
        if (value <= 0)
            throw new RangeError("FOV must be greater than 0");

        this._fov = value;
    }

    getProjectionMatrix(): GLM.mat4 {
        let matrix = GLM.mat4.create();
        GLM.mat4.perspective(matrix, GLM.glMatrix.toRadian(this._fov), this._aspect, this.near, this.far);
        return matrix;
    }
}