import STLObject from "./logics/STLObject";

export default class TestTriangle extends STLObject {
    constructor() {
        const vertices = new Float32Array([
             0.0,  0.0,  0.0,
             0.0,  1.0,  0.0,
             1.0,  1.0,  0.0
        ]);
        super("TestTriangle", vertices);
    }
}