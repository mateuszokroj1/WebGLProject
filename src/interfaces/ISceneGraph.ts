import * as GLM from 'gl-matrix';
import IRenderer from './IRenderer';

export interface ISceneGraphComponent {
    get id(): string;

    getModelTransformation(): GLM.mat4;
    acceptRenderer(visitor: IRenderer): void;
}

export interface ISceneGraphGroup extends ISceneGraphComponent {
    addChild(child: ISceneGraphComponent): void;
    removeChild(child: ISceneGraphComponent): void;
    contains(child: ISceneGraphComponent): boolean;
}