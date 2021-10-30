import * as THREE from 'three'

import vertex from '../shaders/helix/vertex.glsl'
import fragment from '../shaders/helix/fragment.glsl'

class Helix {
  constructor() {
    this.count = 180000
    this.rows = 100
    this.time = 0

    this.textureLoader = new THREE.TextureLoader()

    this.bind()
  }

  init(scene) {
    this.scene = scene

    this.setColors()
    this.setAttributes()
    this.setGeometry()
    this.setMaterial()
    this.setPoints()
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

    this.attributes.sizes = {}
    this.attributes.sizes.data = new Float32Array(this.count / 3)
    this.attributes.sizes.instance = new THREE.BufferAttribute(this.attributes.sizes.data, 1)

    this.attributes.colorRandoms = {}
    this.attributes.colorRandoms.data = new Float32Array(this.count / 3)
    this.attributes.colorRandoms.instance = new THREE.BufferAttribute(this.attributes.colorRandoms.data, 1)

    for(let i = 0; i < this.count / 3; i++) {
      let theta = 0.002 * Math.PI * 2 * Math.floor(i / this.rows)
      let radius = 0.01 * ((i % this.rows) - (this.rows / 2));

      let x = radius * Math.cos(theta)
      let y = 0.01 * Math.floor(i / this.rows) - 3
      let z = radius * Math.sin(theta)

      this.attributes.positions.data.set([x, y, z], i * 3)
      this.attributes.sizes.data.set([Math.random()], i)
      this.attributes.colorRandoms.data.set([Math.random()], i)
    }
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', this.attributes.positions.instance)
    this.geometry.setAttribute('aSize', this.attributes.sizes.instance)
    this.geometry.setAttribute('aColorRandom', this.attributes.colorRandoms.instance)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: this.colors.color1.instance },
        uColor2: { value: this.colors.color2.instance },
        uColor3: { value: this.colors.color3.instance },
        uTexture: { value: this.textureLoader.load('/assets/particleMask.png') },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      // blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    })
  }

  setPoints() {
    this.mesh = new THREE.Points(this.geometry, this.material)
    this.mesh.rotation.order = 'ZYX';
    this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, -1), THREE.Math.degToRad(35))
    this.scene.add(this.mesh)
  }

  update() {
    this.time += 0.002
    this.mesh.rotation.y = this.time
  }

  bind() {

  }
}

const _instance = new Helix()
export default _instance