import { IInitializable } from "../interfaces/IInitializable";

export function getWebGlContext(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('webgl');

    if (context == null || !(context instanceof WebGLRenderingContext))
        throw new Error('Cannot get WebGL context from Canvas HTML element.');

    return context;
}

export function canInitialize(obj: any): obj is IInitializable {
    return !(obj?.isInitialized ?? true);
}

export function fmod(value: number, mod: number): number {
    if (mod < 1)
        throw new Error('Modulus must be greater than or equal to 1.');

    if (value == 0)
        return 0;

    if (value < 0) {
        while (value <= -mod)
            value += mod;
    }
    else {
        while (value >= mod)
            value -= mod;
    }

    return value;
}

export function angleReduction(value: number): number {
    value = fmod(value, 360);

    if (value < 0)
        value = 360 + value;

    return value;
}