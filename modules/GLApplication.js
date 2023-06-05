import * from "./STLFile.js";

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
        this.context.clearColor(20, 20, 20, 255);
        this.context.clear(this.context.COLOR_BUFFER_BIT);

        const stl_file = await fetch("../assets/DeLorean.STL");
        const stl = new STLFile(stl_file);
        

        this._render();
    }

    _render() {

    }
}