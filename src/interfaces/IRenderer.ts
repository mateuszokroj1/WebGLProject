import * as GLM from 'gl-matrix';
import Camera from '../models/Camera';
import Material from '../logics/Material';
import Vertices from '../models/Vertices';
import { ISceneGraphComponent } from './ISceneGraph';

export default interface IRenderer {
    configureWorldParameters(backgroundColor: GLM.vec3): void;
    useCamera(camera: Camera): IRenderer;
    setAmbientLightColor(color: GLM.vec3): IRenderer;
    setDiffuseLight(position: GLM.vec3, color: GLM.vec3): IRenderer;
    setSpecularLight(position: GLM.vec3): IRenderer;
    useMaterial(material: Material): IRenderer;
    useModelTransformation(trafoMatrix: GLM.mat4): IRenderer;
    drawTriangles(trianglesData: Float32Array): IRenderer;
    flush(): void;

    visitSceneComponent(scene_component: ISceneGraphComponent): void;
}