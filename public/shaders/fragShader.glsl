precision mediump float;

uniform vec3 u_ambientLightColor;
uniform vec3 u_diffuseLightColor;
uniform vec3 u_material_baseColor;
uniform float u_material_ambientLightIntensity;
uniform float u_material_diffuseLightIntensity;
uniform float u_material_specularLightIntensity;
uniform float u_material_opacity;

varying vec3 v_normal;
varying vec3 v_diffuseLightDir;
varying vec3 v_specularLightDir;

void main() {
    vec3 ambient_light = u_ambientLightColor * u_material_ambientLightIntensity;
    float diffuse_light_intensity_in_point = abs(dot(v_normal, v_diffuseLightDir));
    vec3 diffuse_light = u_diffuseLightColor * diffuse_light_intensity_in_point * clamp(u_material_diffuseLightIntensity, 0.0, 1.0);

    vec3 specular_reflection_dir = reflect(v_specularLightDir, v_normal);
    float specular_light_point_intensity = pow(abs(dot(v_normal, specular_reflection_dir)), 200.0);
    vec3 specular_light = vec3(1.0, 1.0, 1.0) * specular_light_point_intensity * u_material_specularLightIntensity;

    float opacity = clamp(u_material_opacity, 0.0, 1.0);
    gl_FragColor = vec4(ambient_light + (diffuse_light + specular_light) * u_material_baseColor, opacity);
}