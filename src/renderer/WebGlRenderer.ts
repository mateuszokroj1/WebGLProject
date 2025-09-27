import IRenderer from "../interfaces/IRenderer";
import IWebGlShaderProvider from "../interfaces/IWebGlShaderProvider";
import IRenderingContext from "../models/RenderingContext";

export default class WebGlRenderer implements IRenderer {
    private initialized: boolean = false;
    private vertex_shader: IWebGlShaderProvider | null = null;
    private fragment_shader: IWebGlShaderProvider | null = null;

    isInitialized(): boolean {
        throw new Error("Method not implemented.");
    }

    initialize(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    render(context: IRenderingContext): void {
        throw new Error("Method not implemented.");
    }
}