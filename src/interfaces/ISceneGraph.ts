import * as GLM from 'gl-matrix';
import IRenderer from './IRenderer';

export interface ISceneGraphComponent {
    readonly id: string;

    getModelTransformation(): GLM.mat4;
    render(renderContext: IRenderer): void;
}

export interface ISceneGraphGroup extends ISceneGraphComponent {
    addChild(child: ISceneGraphComponent): void;
    removeChild(child: ISceneGraphComponent): void;
    contains(child: ISceneGraphComponent): boolean;
}