import * as GLM from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import VisibleObjectBase from "../models/VisibleObjectBase";
import { ISceneGraphComponent } from "../interfaces/ISceneGraph";
import { Transformation } from "../models/Transformation";
import Material from "./Material";
import { isBinaryFile } from "arraybuffer-isbinary";
import Box from "../models/Box";

function read3fv(source: DataView, offset: number): Float32Array {
    let arr = new Float32Array(3);

    for (let i = 0; i < 3; ++i)
        arr[i] = source.getFloat32(offset + 4 * i, true);

    return arr;
}

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
    private init_transformation: GLM.mat4 = GLM.mat4.identity(GLM.mat4.create());
    public material: Material | null = null;
    public comment: string = "";

    get isInitialized(): boolean {
        return this.data != null;
    }

    async initialize(argument: HTMLCanvasElement): Promise<void> {
        const request = await fetch(this.file_path);
        if (!request.ok)
            throw new Error(`Cannot load STL file from path ${this.file_path}. Status: ${request.status} ${request.statusText}.`);

        let buffer = await request.arrayBuffer();
        if (buffer == undefined)
            throw new Error(`Cannot read STL file from path ${this.file_path}. Buffer is undefined.`);

        const is_binary = isBinaryFile(buffer);
        let bounding_box = new Box;

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

                    bounding_box.addPoint(GLM.vec3.fromValues(vertex_x, vertex_y, vertex_z));
                    single_vertex = vertex_reg.exec(single_triangle[0]);
                }

                single_triangle = triangle_reg.exec(text);
            }
        }
        else {
            const header = new TextDecoder().decode(buffer.slice(0, 80));
            if (header.trim().length > 0)
                this.comment = header.trim();

            let buffer_position = 80;
            let reader = new DataView(buffer);
            const count = reader.getUint32(buffer_position, true);
            buffer_position += 4;

            for (let i = 0; i < count; i++) {
                const normal = read3fv(reader, buffer_position);
                buffer_position += 4 * 3;

                const v1 = read3fv(reader, buffer_position);
                buffer_position += 4 * 3;

                const v2 = read3fv(reader, buffer_position);
                buffer_position += 4 * 3;

                const v3 = read3fv(reader, buffer_position);
                buffer_position += (4 * 3) + 2;

                data.push(...v1);
                data.push(...normal);
                data.push(...v2);
                data.push(...normal);
                data.push(...v3);
                data.push(...normal);

                bounding_box.addPoint(GLM.vec3.fromValues(...v1));
                bounding_box.addPoint(GLM.vec3.fromValues(...v2));
                bounding_box.addPoint(GLM.vec3.fromValues(...v3));
            }
        }

        this.data = new Float32Array(data);

        const transformed_vertices: GLM.vec3[] = [GLM.vec3.clone(bounding_box.min), GLM.vec3.clone(bounding_box.max)];
        let scaler: number = NaN;

        for (let i = 0; i < 2; ++i) {
            GLM.vec3.subtract(transformed_vertices[i], transformed_vertices[i], bounding_box.center);

            for (let j = 0; j < 3; ++j) {
                let positive_value = Math.abs(transformed_vertices[i][j]);
                if (isNaN(scaler) || scaler < positive_value)
                    scaler = positive_value;
            }
        }

        scaler = 1 / scaler;

        GLM.mat4.translate(this.init_transformation, this.init_transformation, GLM.vec3.fromValues(-bounding_box.center[0] * scaler, -bounding_box.center[1] * scaler, -bounding_box.center[2] * scaler));
        GLM.mat4.scale(this.init_transformation, this.init_transformation, GLM.vec3.fromValues(scaler, scaler, scaler));
    }

    getModelTransformation(): GLM.mat4 {
        let object_trafo = this.objectTransformation.getTransformationMatrix();

        GLM.mat4.multiply(object_trafo, object_trafo, this.init_transformation);

        if (this.parent_group != null)
            GLM.mat4.multiply(object_trafo, object_trafo, this.parent_group.getModelTransformation());

        return object_trafo;
    }

    acceptRenderer(renderer: IRenderer): void {
        if (this.material != null)
            renderer.useMaterial(this.material);

        renderer.useModelTransformation(this.getModelTransformation());

        if (this.data != null)
            renderer.drawTriangles(this.data);

        renderer.flush();
    }
}