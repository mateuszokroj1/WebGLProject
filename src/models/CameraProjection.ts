import * as GLM from 'gl-matrix';
import ICameraProjection from '../interfaces/ICameraProjection';

export class OrthoProjection implements ICameraProjection {
    getProjectionMatrix(): GLM.mat4 {
        throw new Error('Method not implemented.');
    }

}

export class PerspectiveProjection implements ICameraProjection {
    getProjectionMatrix(): GLM.mat4 {
        throw new Error('Method not implemented.');
    }
}