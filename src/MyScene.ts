import Cube from "./Cube";
import { SceneGraphGroup } from "./logics/SceneGraph";
import TestTriangle from "./TestTriangle";

export default class MyScene extends SceneGraphGroup {
    constructor() {
        super();

        this.addChild(new Cube);
    }
}