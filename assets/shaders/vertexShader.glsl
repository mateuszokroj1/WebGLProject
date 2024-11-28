attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform bool isProjected;
uniform bool useLighting;

uniform highp vec3 ambientLight;
uniform highp vec3 directionalLightColor;
uniform highp vec3 directionalLightVector;

varying highp vec3 vectorLighting;

void main()
{
    highp vec4 transformed = modelMatrix * viewMatrix * vec4(position, 1.0);
    gl_Position = isProjected ? projectionMatrix * transformed : transformed;

    if(!useLighting)
    {
        vectorLighting = vec3(0.0,1.0,0.0);
        return;
    }

    highp mat4 normalMatrix = transpose(inverse(modelMatrix * viewMatrix))
    highp vec4 transformedNormal = normalMatrix * vec4(normalize(normal), 0.0);
    highp vec3 dirLightVector = normalize(directionalLightVector);

    highp float directionalLight = dot(transformedNormal.xyz, dirLightVector);
    if(directionalLight < 0.0)
        directionalLight = 0.0;

    vectorLighting = ambientLight + (directionalLightColor * directionalLight);
}