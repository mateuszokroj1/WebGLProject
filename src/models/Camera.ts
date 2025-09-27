import * as GLM from 'gl-matrix';
import ICameraProjection from '../interfaces/ICameraProjection';
import * as CameraProjection from './CameraProjection';

export default class Camera {
    public position: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    public rotation_angles: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    public projection: ICameraProjection = new CameraProjection.OrthoProjection();
}