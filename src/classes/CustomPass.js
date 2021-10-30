import vertex from '../shaders/aberration/vertex.glsl'
import fragment from '../shaders/aberration/fragment.glsl'

export const CustomPass = {
  uniforms: {
    tDiffuse: { value: null },
    distort: { value: 0.5 },
    time: { value: 0 }
  },
  vertexShader: vertex,
  fragmentShader: fragment,
}
