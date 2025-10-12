import { IInitializable } from "../interfaces/IInitializable";

export function getWebGlContext(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('webgl');

    if(context == null || !(context instanceof WebGLRenderingContext))
        throw new Error('Cannot get WebGL context from Canvas HTML element.');

    return context;
}

export function canInitialize(obj: any): obj is IInitializable {
    return !(obj?.isInitialized ?? true);
}