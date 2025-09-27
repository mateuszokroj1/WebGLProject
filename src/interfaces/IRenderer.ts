import IRenderingContext from "../models/RenderingContext";

export default interface IRenderer {
    render(context: IRenderingContext): void;
}