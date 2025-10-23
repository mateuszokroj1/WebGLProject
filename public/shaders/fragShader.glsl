precision mediump float;

uniform mat4 u_modelTransformation;
uniform mat4 u_viewTransformation;

uniform vec3 u_ambientLightColor;
uniform vec3 u_diffuseLightPosition;
uniform vec3 u_diffuseLightColor;
uniform vec3 u_specularLightPosition;
uniform vec3 u_material_baseColor;
uniform float u_material_ambientLightIntensity;
uniform float u_material_diffuseLightIntensity;
uniform float u_material_specularLightIntensity;
uniform float u_material_opacity;

varying vec3 v_normal;

void main()
{
    vec3 ambient_light = u_ambientLightColor * u_material_ambientLightIntensity;
    float diffuse_point_intensity = clamp(dot(v_normal, normalize(u_diffuseLightPosition)), 0.0, 1.0);
    vec3 diffuse_light = u_diffuseLightColor * diffuse_point_intensity * clamp(u_material_diffuseLightIntensity, 0.0, 1.0);

    float opacity = clamp(u_material_opacity, 0.0, 1.0);
    gl_FragColor = vec4((ambient_light + diffuse_light) * u_material_baseColor, opacity);
}