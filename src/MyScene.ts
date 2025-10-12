import { SceneGraphGroup } from "./logics/SceneGraph";
import STLObject from "./logics/STLObject";

export default class MyScene extends SceneGraphGroup {
    constructor() {
        super();

        this.addChild(new STLObject("Cube", "/solids/cube.STL"));
    }
}