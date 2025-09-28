import { mat4 } from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import VisibleObjectBase from "../models/VisibleObjectBase";
import { IInitializable } from "../interfaces/IInitializable";
import Vertices from "../models/Vertices";

export default class STLObject extends VisibleObjectBase implements IInitializable<HTMLCanvasElement> {
    constructor(name: string, file_pathOrData: string | Vertices) {
        super(name);
        if (typeof file_pathOrData === "string") {
            this.file_path = file_pathOrData;
        } else {
            this.data = file_pathOrData;
        }
    }

    private data: Vertices | null = null;
    private file_path: string = "";

    get isInitialized(): boolean {
        return this.data != null;
    }

    async initialize(argument: HTMLCanvasElement): Promise<void> {
        const request = await fetch(this.file_path);
        if (!request.ok)
            throw new Error(`Cannot load STL file from path ${this.file_path}. Status: ${request.status} ${request.statusText}.`);



        this.data = new Vertices();
    }




    getModelTransformation(): mat4 {
        throw new Error("Method not implemented.");
    }

    render(renderContext: IRenderer): void {
        throw new Error("Method not implemented.");
    }
}