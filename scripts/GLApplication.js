export class GLApplication {
    canvas;
    context;

    constructor(window, canvas_selector) {
        const element = window.document.querySelector(canvas_selector);

        if (element instanceof HTMLCanvasElement)
            this.canvas = element;
        else
            throw "Unable to find canvas element for WebGL rendering.";

        const context = this.canvas.getContext("webgl");
        if (context instanceof WebGLRenderingContext)
            this.context = context;
        else
            throw "Unable to initialize WebGL. Your browser or machine may not support it.";
    }

    async init() {
        this.context.clearColor(255, 255, 255, 0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);

        const stl_file = await fetch("../assets/DeLorean.STL");
        const stl = await stl_file.text();

        this._render();
    }

    _render() {

    }
}