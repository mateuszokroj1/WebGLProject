import { IInitializable } from "../interfaces/IInitializable";
import IRenderer from "../interfaces/IRenderer";
import IWebGlShaderProvider from "../interfaces/IWebGlShaderProvider";
import IRenderingContext from "../models/RenderingContext";

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

    render(context: IRenderingContext): void {
        throw new Error("Method not implemented.");
    }
}