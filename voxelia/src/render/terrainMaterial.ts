/**
 * Shader du terrain : décode les sommets compressés (3 entiers), applique la texture
 * tableau, la teinte de biome, l'éclairage lisse (ciel + blocs), l'occlusion ambiante,
 * l'ombrage directionnel, l'ondulation de la végétation et le brouillard.
 */
import * as THREE from 'three';

export interface TerrainUniforms {
  [k: string]: THREE.IUniform;
  uAtlas: THREE.IUniform<THREE.Texture | null>;
  uTime: THREE.IUniform<number>;
  uDaylight: THREE.IUniform<number>;
  uSkyTint: THREE.IUniform<THREE.Color>;
  uFogColor: THREE.IUniform<THREE.Color>;
  uFogNear: THREE.IUniform<number>;
  uFogFar: THREE.IUniform<number>;
  uBrightness: THREE.IUniform<number>;
  uWave: THREE.IUniform<number>;
  uAlpha: THREE.IUniform<number>;
  uFlash: THREE.IUniform<number>;
}

const vertex = /* glsl */ `
precision highp float;
precision highp int;
in uvec3 aData;
uniform float uTime;
uniform float uWave;
out vec2 vUv;
flat out float vLayer;
flat out float vOverlay;
out vec3 vTint;
out float vShade;
out vec2 vLight;
out float vFogDepth;

const float SHADES[7] = float[7](0.6, 0.6, 1.0, 0.5, 0.8, 0.8, 0.92);
const float AO[4] = float[4](0.42, 0.62, 0.8, 1.0);

void main() {
  uint w0 = aData.x;
  uint w1 = aData.y;
  uint w2 = aData.z;
  vec3 pos = vec3(float(w0 & 1023u), float((w0 >> 10u) & 1023u), float((w0 >> 20u) & 1023u)) / 32.0 - 1.0;
  float u = float(w1 & 31u);
  float v = float((w1 >> 5u) & 31u);
  float layer = float((w1 >> 10u) & 2047u);
  bool tinted = ((w1 >> 21u) & 1u) == 1u;
  bool overlay = ((w1 >> 22u) & 1u) == 1u;
  float frames = float((w1 >> 23u) & 31u) + 1.0;
  bool wave = ((w1 >> 28u) & 1u) == 1u;
  uint shadeIdx = (w1 >> 29u) & 7u;

  if (frames > 1.0) layer += mod(floor(uTime * 10.0), frames);

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  if (wave && uWave > 0.0 && !(shadeIdx == 6u && v > 15.5)) {
    float t = uTime * 1.6;
    worldPos.x += sin(t + worldPos.x * 0.6 + worldPos.z * 0.3) * 0.045 * uWave;
    worldPos.z += cos(t * 0.8 + worldPos.z * 0.5 + worldPos.x * 0.2) * 0.035 * uWave;
  }
  vec4 mv = viewMatrix * worldPos;
  gl_Position = projectionMatrix * mv;
  vFogDepth = max(length(worldPos.xz - cameraPosition.xz), abs(worldPos.y - cameraPosition.y) * 0.35);

  vUv = vec2(u, v) / 16.0;
  vLayer = layer;
  vOverlay = overlay ? 1.0 : 0.0;
  uint c = w2 & 65535u;
  vec3 tint = vec3(float((c >> 11u) & 31u) / 31.0, float((c >> 5u) & 63u) / 63.0, float(c & 31u) / 31.0);
  vTint = (tinted || overlay) ? tint : vec3(1.0);
  uint ao = (w2 >> 30u) & 3u;
  vShade = SHADES[shadeIdx] * AO[ao];
  vLight = vec2(float((w2 >> 16u) & 127u), float((w2 >> 23u) & 127u)) / 8.0;
}
`;

const fragment = /* glsl */ `
precision highp float;
precision highp int;
precision highp sampler2DArray;
uniform sampler2DArray uAtlas;
uniform float uDaylight;
uniform vec3 uSkyTint;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uBrightness;
uniform float uAlpha;
uniform float uFlash;
in vec2 vUv;
flat in float vLayer;
flat in float vOverlay;
in vec3 vTint;
in float vShade;
in vec2 vLight;
in float vFogDepth;
out highp vec4 fragColor;

float curve(float l) {
  float f = 1.0 - l / 15.0;
  float b = (1.0 - f) / (f * 3.0 + 1.0);
  return mix(b, sqrt(b), uBrightness * 0.6);
}

void main() {
  vec4 tex = texture(uAtlas, vec3(vUv, vLayer));
  vec3 color;
  if (vOverlay > 0.5) {
    vec4 ov = texture(uAtlas, vec3(vUv, vLayer + 1.0));
    if (ov.a > 0.5) { color = ov.rgb * vTint; tex.a = 1.0; }
    else color = tex.rgb;
    if (tex.a < 0.5 && ov.a < 0.5) discard;
  } else {
    color = tex.rgb * vTint;
  }
  #ifdef CUTOUT
  if (tex.a < 0.5) discard;
  float alpha = 1.0;
  #else
  if (tex.a < 0.02) discard;
  float alpha = tex.a * uAlpha;
  #endif

  float sky = curve(vLight.x) * uDaylight;
  float blk = curve(vLight.y);
  vec3 skyCol = sky * uSkyTint;
  vec3 blkCol = blk * vec3(1.0, 0.86, 0.68);
  vec3 light = max(skyCol, blkCol) + 0.05 + uFlash * 0.6 * curve(vLight.x);
  color *= light * vShade;

  float fog = smoothstep(uFogNear, uFogFar, vFogDepth);
  color = mix(color, uFogColor, fog);
  fragColor = vec4(color, alpha);
}
`;

export function createTerrainUniforms(atlas: THREE.Texture): TerrainUniforms {
  return {
    uAtlas: { value: atlas },
    uTime: { value: 0 },
    uDaylight: { value: 1 },
    uSkyTint: { value: new THREE.Color(1, 1, 1) },
    uFogColor: { value: new THREE.Color(0.75, 0.85, 1) },
    uFogNear: { value: 60 },
    uFogFar: { value: 120 },
    uBrightness: { value: 0.5 },
    uWave: { value: 1 },
    uAlpha: { value: 1 },
    uFlash: { value: 0 },
  };
}

export function createTerrainMaterials(uniforms: TerrainUniforms): { solid: THREE.ShaderMaterial; translucent: THREE.ShaderMaterial } {
  const solid = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    defines: { CUTOUT: 1 },
    side: THREE.FrontSide,
  });
  const transUniforms = { ...uniforms, uAlpha: { value: 0.82 } };
  const translucent = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: transUniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
  return { solid, translucent };
}
