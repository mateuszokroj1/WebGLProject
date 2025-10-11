uniform mat4 u_viewTransformation;
uniform mat4 u_projectionTransformation;
uniform mat4 u_modelTransformation;
uniform vec3 u_ambientLightColor;
uniform vec3 u_diffuseLightPosition;
uniform vec3 u_diffuseLightColor;
uniform vec3 u_specularLightPosition;
uniform vec3 u_material_baseColor;
uniform float u_material_ambientLightIntensity;
uniform float u_material_diffuseLightIntensity;
uniform float u_material_specularLightIntensity;

void main()
{
    gl_Position = vec4(0,0,0,1);
}