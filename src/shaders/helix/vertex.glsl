attribute float aSize;
attribute float aColorRandom;

varying float vColorRandom;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = (10.0 * aSize + 1.0) * (1.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  // varying
  vColorRandom = aColorRandom;
}