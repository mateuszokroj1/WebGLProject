import * as GLM from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import { IInitializable } from "../interfaces/IInitializable";
import { Transformation } from "../models/Transformation";
import { ISceneGraphComponent, ISceneGraphGroup } from "../interfaces/ISceneGraph";
import * as Tools from "../tools/Functions";

export abstract class SceneGraphComponentBase implements ISceneGraphComponent {
    public readonly id: string = crypto.randomUUID();

    abstract getModelTransformation(): GLM.mat4;
    abstract acceptRenderer(visitor: IRenderer): void;
}

abstract class SceneGraphGroupBase extends SceneGraphComponentBase implements ISceneGraphGroup {
    protected children: ISceneGraphComponent[] = [];

    addChild(child: ISceneGraphComponent): void {
        if (!this.contains(child))
            this.children.push(child);
        else
            throw new Error("Child already exists in the scene graph.");
    }

    removeChild(child: ISceneGraphComponent): void {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].id === child.id) {
                this.children.splice(i, 1);
                return;
            }
        }
    }

    contains(other: ISceneGraphComponent): boolean {
        for (const child of this.children) {
            if (child.id === other.id)
                return true;

            if (Tools.isInType<ISceneGraphGroup>(child) && child.contains(other))
                return true;
        }

        return false;
    }
}

export class SceneGraphGroup extends SceneGraphGroupBase implements IInitializable<HTMLCanvasElement> {
    public groupTransformation: Transformation = new Transformation();

    getModelTransformation(): GLM.mat4 {
        return this.groupTransformation.getTransformationMatrix();
    }

    get isInitialized(): boolean {
        for (const child of this.children) {
            if (Tools.isInType<IInitializable<any>>(child) && !child.isInitialized)
                return false;
        }

        return true;
    }

    async initialize(argument: HTMLCanvasElement): Promise<void> {
        for (let child of this.children) {
            if (Tools.isInType<IInitializable<HTMLCanvasElement>>(child))
                await child.initialize(argument);
        }
    }

    acceptRenderer(visitor: IRenderer): void {
        for(const child of this.children)
            child.acceptRenderer(visitor);
    }
}

export class EmptyScene extends SceneGraphComponentBase
{
    getModelTransformation(): GLM.mat4 {
        return GLM.mat4.identity(GLM.mat4.create());
    }

    acceptRenderer(_visitor: IRenderer): void {
    }
}