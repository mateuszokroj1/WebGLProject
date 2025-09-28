import IRenderingContext from "../models/RenderingContext";
import { IInitializable } from "./IInitializable";

export default interface IRenderer {
    render(context: IRenderingContext): void;
}