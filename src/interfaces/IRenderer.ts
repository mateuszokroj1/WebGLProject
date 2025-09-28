import * as GLM from 'gl-matrix';

export default interface IRenderer {
    useMaterial(material: Material): void;
    useModelTransformation(trafoMatrix: GLM.mat4): void;
    drawTriangles(trainglesData: Vertices): void;
    flush(): void;
}