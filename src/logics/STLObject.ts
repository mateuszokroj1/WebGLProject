import * as GLM from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import VisibleObjectBase from "../models/VisibleObjectBase";
import { ISceneGraphComponent } from "../interfaces/ISceneGraph";
import { Transformation } from "../models/Transformation";
import Material from "./Material";
import { isBinaryFile } from "arraybuffer-isbinary";
import Box from "../models/Box";

export default class STLObject extends VisibleObjectBase {
    constructor(name: string, file_pathOrData: string | Float32Array) {
        super(name);
        if (typeof file_pathOrData === "string") {
            this.file_path = file_pathOrData;
        } else {
            this.data = file_pathOrData;
        }
    }

    public objectTransformation: Transformation = new Transformation();
    private data: Float32Array | null = null;
    private file_path: string = "";
    public parent_group: ISceneGraphComponent | null = null;
    private _bounding_box: Box = new Box;
    public material: Material | null = null;
    public comment: string = "";

    get isInitialized(): boolean {
        return this.data != null;
    }

    async initialize(argument: HTMLCanvasElement): Promise<void> {
        const request = await fetch(this.file_path);
        if (!request.ok)
            throw new Error(`Cannot load STL file from path ${this.file_path}. Status: ${request.status} ${request.statusText}.`);

        const buffer = (await request.body?.getReader().read())?.value;
        if (buffer == undefined)
            throw new Error(`Cannot read STL file from path ${this.file_path}. Buffer is undefined.`);

        const is_binary = isBinaryFile(buffer);

        let data: number[] = [];
        if (!is_binary) {
            let text = "";
            {
                const decoder = new TextDecoder();
                text = decoder.decode(buffer);
            }

            const full_text_checker = /^\s*solid(\s(?<header>\w[\w\d\_]+))\s+(?<content>[\S\s]+)\s+endsolid(.|\s)*$/im;
            const match1 = full_text_checker.exec(text);
            if (match1 == null)
                return

            const header = match1.groups?.header ?? "";
            if (header.trim().length > 0)
                this.comment = header.trim();

            const content = match1.groups?.content ?? "";
            if (content.length == 0)
                return;

            const triangle_reg = /\s*facet\s+normal\s+(?<normal_x>\-?\d+([\.\,]\d+)?)\s+(?<normal_y>\-?\d+([\.\,]\d+)?)\s+(?<normal_z>\-?\d+([\.\,]\d+)?)\s+outer\s+loop\s+((vertex\s+((\-?\d+([\.\,]\d+)?)\s+){3})){3}\s*endloop\s+endfacet/ig;

            const vertex_reg = /vertex\s+(?<x>\-?\d+([\,\.]\d+)?)\s+(?<y>\-?\d+([\,\.]\d+)?)\s+(?<z>\-?\d+([\,\.]\d+)?)/gi;
            let single_triangle = triangle_reg.exec(text);
            while (single_triangle != null) {
                if (single_triangle.groups == undefined) break;

                const normal_x = parseFloat(single_triangle.groups.normal_x);
                const normal_y = parseFloat(single_triangle.groups.normal_y);
                const normal_z = parseFloat(single_triangle.groups.normal_z);

                let single_vertex = vertex_reg.exec(single_triangle[0]);
                while (single_vertex != null) {
                    if (single_vertex.groups == undefined) break;

                    const vertex_x = parseFloat(single_vertex.groups.x);
                    const vertex_y = parseFloat(single_vertex.groups.y);
                    const vertex_z = parseFloat(single_vertex.groups.z);
                    data.push(vertex_x);
                    data.push(vertex_y);
                    data.push(vertex_z);
                    data.push(normal_x);
                    data.push(normal_y);
                    data.push(normal_z);

                    this._bounding_box.addPoint(GLM.vec3.fromValues(vertex_x, vertex_y, vertex_z));
                    single_vertex = vertex_reg.exec(single_triangle[0]);
                }

                single_triangle = triangle_reg.exec(text);
            }
        }
        else {
            const header = new TextDecoder().decode(buffer.slice(0, 80));
            if (header.trim().length > 0)
                this.comment = header.trim();

            const count = new Uint32Array(buffer.slice(80, 84))[0]

            for (let i = 0; i < count; i++) {
                const triangle_bytesize = 12 * 4; // 12x float32
                const startPosition = 84 + i * (triangle_bytesize + 2); // 2 bytes for attribute byte count

                const floats = new Float32Array(buffer.slice(startPosition, startPosition + triangle_bytesize))

                const normal = [floats[0], floats[1], floats[2]];
                const v1 = [floats[3], floats[4], floats[5]];
                const v2 = [floats[6], floats[7], floats[8]];
                const v3 = [floats[9], floats[10], floats[11]];

                data.push(...v1);
                data.push(...normal);
                data.push(...v2);
                data.push(...normal);
                data.push(...v3);
                data.push(...normal);

                this._bounding_box.addPoint(GLM.vec3.fromValues(...v1));
                this._bounding_box.addPoint(GLM.vec3.fromValues(...v2));
                this._bounding_box.addPoint(GLM.vec3.fromValues(...v3));
            }
        }

        this.data = new Float32Array(data);
    }

    getModelTransformation(): GLM.mat4 {
        let object_trafo = this.objectTransformation.getTransformationMatrix();

        if (this.parent_group != null)
            GLM.mat4.multiply(object_trafo, object_trafo, this.parent_group.getModelTransformation());

        return object_trafo;
    }

    getBoundingBox(): Box {
        return this._bounding_box;
    }

    acceptRenderer(renderer: IRenderer): void {
        if (this.material != null)
            renderer.useMaterial(this.material);
/*
        const final_model_transformation = GLM.mat4.identity(GLM.mat4.create());
        const gravity_center = this._bounding_box.center;
        const radius1: number = GLM.vec3.distance(this._bounding_box.min, gravity_center);
        const radius2: number = GLM.vec3.distance(this._bounding_box.max, gravity_center);
        const scaler = 1 / Math.max(radius1, radius2);

        GLM.mat4.translate(final_model_transformation, final_model_transformation, GLM.vec3.fromValues(-gravity_center[0], -gravity_center[1], -gravity_center[2]));
        GLM.mat4.scale(final_model_transformation, final_model_transformation, GLM.vec3.fromValues(scaler, scaler, scaler));

        GLM.mat4.multiply(final_model_transformation, final_model_transformation, this.getModelTransformation());*/
        renderer.useModelTransformation(this.getModelTransformation());

        if (this.data != null)
            renderer.drawTriangles(this.data);

        renderer.flush();
    }
}