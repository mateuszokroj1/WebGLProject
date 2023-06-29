uniform highp vec3 basicColor;
uniform bool useLighting;

varying highp vec3 vectorLighting;

void main()
{
    gl_FragColor = useLighting ? vec4(basicColor.rgb * vectorLighting, 1.0) : vec4(basicColor.rgb, 1.0);
}