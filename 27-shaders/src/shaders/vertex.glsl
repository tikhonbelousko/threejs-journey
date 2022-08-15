uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uTime;
uniform vec2 uFrequency;
uniform sampler2D uTexture;

attribute vec3 position;
attribute vec2 uv;

varying float vElevation;
varying vec2 vUv;


void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1 + sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
  modelPosition.z += elevation;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vElevation = elevation;
  vUv = uv;
}
