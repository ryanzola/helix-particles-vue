import * as THREE from 'three'

import vertex from '../shaders/particles/vertex.glsl'
import fragment from '../shaders/particles/fragment.glsl'


class Particles {
  constructor() {
      this.bind()

      this.count = 4032
      this.rows = 50
      this.time = 0
      this.scale = 4

      this.textureLoader = new THREE.TextureLoader()
  }

  init(scene) {
    this.scene = scene

    this.setColors()
    this.setAttributes()
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setColors() {
    this.colors = {}

    this.colors.color1 = {}
    this.colors.color1.value = '#652174'
    this.colors.color1.instance = new THREE.Color(this.colors.color1.value)

    this.colors.color2 = {}
    this.colors.color2.value = '#293583'
    this.colors.color2.instance = new THREE.Color(this.colors.color2.value)

    this.colors.color3 = {}
    this.colors.color3.value = '#1954ec'
    this.colors.color3.instance = new THREE.Color(this.colors.color3.value)
  }

  setAttributes() {
    this.attributes = {}

    this.attributes.positions = {}
    this.attributes.positions.data = new Float32Array(this.count)
    this.attributes.positions.instance = new THREE.BufferAttribute(this.attributes.positions.data, 3)

    this.attributes.alpha = {}
    this.attributes.alpha.data = new Float32Array(this.count)
    this.attributes.alpha.instance = new THREE.BufferAttribute(this.attributes.alpha.data, 1)

    this.attributes.colorRandoms = {}
    this.attributes.colorRandoms.data = new Float32Array(this.count / 3)
    this.attributes.colorRandoms.instance = new THREE.BufferAttribute(this.attributes.colorRandoms.data, 1)

    for(let i = 0; i < this.count / 3; i++) {
      let theta = 0.1 * Math.PI * 2 * Math.floor(i / this.rows)
      let radius = 0.05 * ((i % this.rows) - (this.rows / 2));

      let x = radius * Math.sin(theta) * this.scale
      let y = (Math.random() * this.scale) - (this.scale / 2)
      let z = radius * Math.cos(theta) *  this.scale

      this.attributes.positions.data.set([x, y, z], i * 3)
      this.attributes.alpha.data.set([Math.random()], i)
      this.attributes.colorRandoms.data.set([Math.random()], i)
    }
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', this.attributes.positions.instance)
    this.geometry.setAttribute('aAlpha', this.attributes.alpha.instance)
    this.geometry.setAttribute('aColorRandom', this.attributes.colorRandoms.instance)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.textureLoader.load('/assets/particleMask.png') },
        uColor1: { value: this.colors.color1.instance },
        uColor2: { value: this.colors.color2.instance },
        uColor3: { value: this.colors.color3.instance },
        uSizeMultiplier: { value: 2 }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }

  setMesh() {
    this.mesh = new THREE.Points(this.geometry, this.material)
    this.mesh.rotation.order = 'ZYX';
    this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, -1), THREE.Math.degToRad(35))

    this.scene.add(this.mesh)
  }

  update() {
    this.time += 0.002

    this.mesh.rotation.y = this.time / 2

    let i = 0
    while(i < this.count) {
      this.geometry.attributes.position.array[i * 3 + 1] += 0.0005

      if(this.geometry.attributes.position.array[i * 3 + 1] > this.scale / 2) {
        this.geometry.attributes.position.array[i * 3 + 1] =  - this.scale / 2
      }

      i++
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  bind() {

  }
}

const _instance = new Particles()
export default _instance