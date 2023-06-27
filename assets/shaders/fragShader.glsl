uniform lowp vec4 basicColor;
uniform bool useLighting;

varying highp vec3 vectorLighting;

void main()
{
    gl_FragColor = useLighting ? vec4(basicColor.rgb * vectorLighting, basicColor.a) : basicColor;
}