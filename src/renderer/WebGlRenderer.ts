import { mat4 } from "gl-matrix";
import { IInitializable } from "../interfaces/IInitializable";
import IRenderer from "../interfaces/IRenderer";
import IWebGlShaderProvider from "../interfaces/IWebGlShaderProvider";
import Material from "../logics/Material";
import Vertices from "../models/Vertices";

export default class WebGlRenderer implements IRenderer, IInitializable<HTMLCanvasElement> {
    private _isInitialized: boolean = false;
    private vertex_shader: IWebGlShaderProvider | null = null;
    private fragment_shader: IWebGlShaderProvider | null = null;

    get isInitialized(): boolean {
        return this._isInitialized;
    }

    initialize(canvas: HTMLCanvasElement): Promise<void> {
        throw new Error("Method not implemented.");
    }

    useMaterial(material: Material): void {
        throw new Error("Method not implemented.");
    }

    useModelTransformation(trafoMatrix: mat4): void {
        throw new Error("Method not implemented.");
    }

    drawTriangles(trainglesData: Vertices): void {
        throw new Error("Method not implemented.");
    }

    flush(): void {
        throw new Error("Method not implemented.");
    }
}