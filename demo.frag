precision mediump float;

#pragma glslify: atmosphere = require('glsl-atmosphere')

varying vec3 vpos;

void main() {
  // magic numbers for which my understanding is limited!
  // lovely results all the same, explained here:
  // https://github.com/wwwtyro/glsl-atmosphere
  vec3 color = normalize(vpos * 0.5 + 0.5);

  color += 1.5 * max(0.0, -vpos.y * 3.);
  color *= 1.0 - pow(sin(vpos.y * 70.0) * 0.5 + 0.5, 30.) * vec3(0.1, 0.1, 0.5);
  color *= 1.0 - pow(sin(vpos.x * 70.0) * 0.5 + 0.5, 30.) * vec3(0.5, 0.1, 0.1);

  gl_FragColor = vec4(1.0 - exp(-color), 1);
}
