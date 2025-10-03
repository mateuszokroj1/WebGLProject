export function isInType<T>(obj: any): obj is T {
    return true;
}

export function getWebGlContext(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('webgl');

    if(context == null || !isInType<WebGL2RenderingContext>(context))
        throw new Error('Cannot get WebGL context from Canvas HTML element.');

    return context;
}