import {mat4} from 'gl-matrix';

export default interface ICameraProjection {
    getProjectionMatrix(): mat4;
}