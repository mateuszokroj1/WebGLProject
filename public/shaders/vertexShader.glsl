attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_viewTransformation;
uniform mat4 u_projectionTransformation;
uniform mat4 u_modelTransformation;

varying vec3 v_normal;

void main() {
    mat4 trafo = u_projectionTransformation * u_viewTransformation * u_modelTransformation;
    gl_Position = trafo * vec4(a_position, 1.0);

    v_normal = (u_modelTransformation * u_viewTransformation * vec4(a_normal, 0)).xyz;
}