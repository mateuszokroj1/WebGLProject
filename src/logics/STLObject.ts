import * as GLM from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import VisibleObjectBase from "../models/VisibleObjectBase";
import { IInitializable } from "../interfaces/IInitializable";
import Vertices from "../models/Vertices";
import { ISceneGraphComponent } from "../interfaces/ISceneGraph";
import { Transformation } from "../models/Transformation";
import Material from "./Material";

export default class STLObject extends VisibleObjectBase implements IInitializable<HTMLCanvasElement> {
    constructor(name: string, file_pathOrData: string | Vertices) {
        super(name);
        if (typeof file_pathOrData === "string") {
            this.file_path = file_pathOrData;
        } else {
            this.data = file_pathOrData;
        }
    }

    public objectTransformation: Transformation = new Transformation();
    private data: Vertices | null = null;
    private file_path: string = "";
    public parent_group: ISceneGraphComponent | null = null;
    public material: Material | null = null;

    get isInitialized(): boolean {
        return this.data != null;
    }

    async initialize(argument: HTMLCanvasElement): Promise<void> {
        const request = await fetch(this.file_path);
        if (!request.ok)
            throw new Error(`Cannot load STL file from path ${this.file_path}. Status: ${request.status} ${request.statusText}.`);

        //TODO copy from old implementation

        this.data = new Vertices();
    }

    getModelTransformation(): GLM.mat4 {
        let object_trafo = this.objectTransformation.getTransformationMatrix();

        if (this.parent_group != null)
            GLM.mat4.multiply(object_trafo, object_trafo, this.parent_group.getModelTransformation());

        return object_trafo;
    }

    render(renderContext: IRenderer): void {
        renderContext.useMaterial(this.material);
        renderContext.useModelTransformation(this.getModelTransformation());
        renderContext.drawTriangles(this.data);

        renderContext.flush();
    }
}