attribute float aAlpha;
attribute float aSize;
attribute float aColorRandom;

uniform float uSizeMultiplier;
uniform float uTime;

varying float vColorRandom;
varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = (10.0 * aSize + 5.0) * uSizeMultiplier * (1.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  // varying
  vAlpha = aAlpha;
  vColorRandom = aColorRandom;
}