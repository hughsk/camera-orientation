precision mediump float;

uniform mat4 proj;
uniform mat4 view;
varying vec3 vpos;

attribute vec3 position;

void main() {
  gl_Position = proj * view * vec4(vpos = position, 1);
}
