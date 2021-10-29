uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform sampler2D uTexture;

varying float vColorRandom;


void main() {
  float alpha = texture2D(uTexture, gl_PointCoord).r;
  vec3 color = uColor1;

  if(vColorRandom > 0.33 && vColorRandom < 0.66) color = uColor2;
  if(vColorRandom >= 0.66) color = uColor3;

  gl_FragColor = vec4(color, alpha);
}