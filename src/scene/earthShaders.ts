export const earthVertex = /* glsl */`
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalWorld;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  // Bodies use uniform scale; modelMatrix is valid for these normals.
  vNormalWorld = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}`
export const earthFragment = /* glsl */`
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform float twilight;
uniform vec3 sunDirection;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalWorld;
void main() {
  float sunDot = dot(normalize(vNormalWorld), sunDirection);
  float night = 1.0 - smoothstep(-twilight, twilight, sunDot);
  vec3 day = texture2D(dayMap, vUv).rgb;
  vec3 city = texture2D(nightMap, vUv).rgb;
  vec3 color = day * (0.025 + 1.15 * max(sunDot, 0.0)) + city * night * 1.8;
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
export const atmosphereFragment = /* glsl */`
uniform vec3 sunDirection;
varying vec3 vWorld;
varying vec3 vNormalWorld;
void main() {
  vec3 normal = normalize(vNormalWorld);
  vec3 toEye = normalize(cameraPosition - vWorld);
  float rim = pow(1.0 - abs(dot(normal, toEye)), 3.0);
  float sunlight = smoothstep(-0.2, 0.65, dot(normal, normalize(-vWorld)));
  gl_FragColor = vec4(vec3(0.14, 0.43, 1.0), rim * (0.12 + 0.6 * sunlight));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
