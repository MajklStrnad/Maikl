<template>
  <canvas ref="cv" class="sakura-blossom" aria-hidden="true"></canvas>
</template>

<script setup>
/*
 * Silver sakura blossom for the middle of the spiral.
 * It never animates on its own: the parent calls update(angle, opacity)
 * from its own frame loop, so the blossom only turns when the spiral does.
 */
import * as THREE from 'three'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const cv = ref(null)

let renderer, scene, camera, group, env
let lastAngle = NaN
let lastOpacity = -1
let dirty = true

// studio-style environment painted on a canvas, for the metal reflections
function buildEnv() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#555a64')
  grad.addColorStop(0.5, '#17181c')
  grad.addColorStop(1, '#050506')
  g.fillStyle = grad
  g.fillRect(0, 0, 1024, 512)
  ;[[60, 34, 0.9], [250, 80, 0.6], [470, 26, 1], [660, 70, 0.65], [880, 40, 0.9]].forEach((b) => {
    g.fillStyle = 'rgba(255,255,255,' + b[2] + ')'
    g.fillRect(b[0], 80, b[1], 280)
  })
  g.fillStyle = 'rgba(255,255,255,0.5)'
  g.fillRect(0, 50, 1024, 14)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const pmrem = new THREE.PMREMGenerator(renderer)
  const rt = pmrem.fromEquirectangular(tex)
  tex.dispose()
  pmrem.dispose()
  return rt.texture
}

// the blossom geometry (same build as the standalone page)
function buildBloom(env) {
    // Petal: pointed tip, wide shoulders, narrowing to the centre (base near origin, tip at y = 1.8)
    var PIV = 0.9;
    function petalPath(p, sx, sy){
      function X(x){ return x*sx; }
      function Y(y){ return PIV + (y-PIV)*sy; }
      p.moveTo(X(0), Y(0.05));
      p.bezierCurveTo(X(0.25),Y(0.45), X(0.66),Y(0.75), X(0.63),Y(1.12));
      p.bezierCurveTo(X(0.60),Y(1.45), X(0.22),Y(1.58), X(0),   Y(1.80));
      p.bezierCurveTo(X(-0.22),Y(1.58), X(-0.60),Y(1.45), X(-0.63),Y(1.12));
      p.bezierCurveTo(X(-0.66),Y(0.75), X(-0.25),Y(0.45), X(0),   Y(0.05));
      return p;
    }
    // Fine outline: the hole is the same curve scaled in just a touch
    function outlineShape(){
      var sh = petalPath(new THREE.Shape(), 1, 1);
      sh.holes.push(petalPath(new THREE.Path(), 0.925, 0.965));
      return sh;
    }
    // Slim crescent accent just inside each lower flank
    function crescentShape(sg){
      var s = new THREE.Shape();
      s.moveTo(sg*0.43, 1.10);
      s.quadraticCurveTo(sg*0.46, 0.80, sg*0.31, 0.60);
      s.quadraticCurveTo(sg*0.425, 0.84, sg*0.43, 1.10);
      return s;
    }

    function slab(shape, depth, bevel){
      var gg = new THREE.ExtrudeGeometry(shape, {
        depth:depth, bevelEnabled:true, bevelThickness:bevel, bevelSize:bevel*0.8,
        bevelSegments:4, curveSegments:40
      });
      gg.translate(0,0,-depth/2);
      return gg;
    }

    var steel = new THREE.MeshStandardMaterial({color:0x9a9da5, metalness:1, roughness:0.2, envMap:env, envMapIntensity:1.2});

    var outlineGeo = slab(outlineShape(), 0.07, 0.01);
    var crescentL  = slab(crescentShape(-1), 0.06, 0.006);
    var crescentR  = slab(crescentShape(1),  0.06, 0.006);
    // Stamens: flat like the outline (same depth, same metal), each a gently bowed filament ending in a small pointed almond
    var FL = 0.55, BOW = 0.05, F0 = 0.17;
    function fx(t){ return BOW*Math.sin(Math.PI*t); }
    function fy(t){ return F0 + FL*t; }
    var filament = new THREE.Shape(), N = 24, k, t, w;
    for(k=0;k<=N;k++){ t=k/N; w=0.014-0.009*t; if(k===0) filament.moveTo(fx(t)-w, fy(t)); else filament.lineTo(fx(t)-w, fy(t)); }
    for(k=N;k>=0;k--){ t=k/N; w=0.014-0.009*t; filament.lineTo(fx(t)+w, fy(t)); }
    filament.closePath();
    function almondPath(s, p){
      function X(x){ return x*s; }
      function Y(y){ return 0.13+(y-0.13)*s; }
      p.moveTo(X(0),Y(0));
      p.bezierCurveTo(X(0.065),Y(0.06), X(0.065),Y(0.17), X(0),Y(0.26));
      p.bezierCurveTo(X(-0.065),Y(0.17), X(-0.065),Y(0.06), X(0),Y(0));
      return p;
    }
    var almondShape = almondPath(1, new THREE.Shape());
    almondShape.holes.push(almondPath(0.45, new THREE.Path()));
    var filGeo = slab(filament, 0.07, 0.008);
    var almGeo = slab(almondShape, 0.07, 0.006);
    var almAngle = Math.atan2(BOW*Math.PI, FL);

    var STEP = Math.PI*2/5;
    var bloom = new THREE.Group();

    for(var i=0;i<5;i++){
      var a = i*STEP;

      var pet = new THREE.Group();
      pet.add(new THREE.Mesh(outlineGeo, steel));
      pet.add(new THREE.Mesh(crescentL, steel));
      pet.add(new THREE.Mesh(crescentR, steel));
      pet.rotation.z = a;
      bloom.add(pet);

      // Stamen runs along the petal's centre line, inside the blossom
      pet.add(new THREE.Mesh(filGeo, steel));
      var alm = new THREE.Mesh(almGeo, steel);
      alm.position.set(fx(1), fy(1), 0); alm.rotation.z = almAngle;
      pet.add(alm);
    }

    // Tiny five-point rosette at the centre, turned to sit between the stamens
    var rosetteGeo = slab(petalPath(new THREE.Shape(),1,1), 0.07, 0.01);
    rosetteGeo.scale(0.1, 0.1, 1);
    for(var j=0;j<5;j++){
      var rp = new THREE.Mesh(rosetteGeo, steel);
      rp.rotation.z = j*STEP + STEP/2;
      bloom.add(rp);
    }

    bloom.scale.set(1.2,1.2,1.2);
    bloom.position.y = -0.2;

  return bloom
}

onMounted(() => {
  renderer = new THREE.WebGLRenderer({ canvas: cv.value, antialias: true, alpha: true })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  camera.position.set(0, 0, 10.5)

  env = buildEnv()
  group = new THREE.Group()
  group.add(buildBloom(env))
  group.rotation.x = 0.105 // 6deg, matches the spiral's rotateX(-6deg) tilt
  scene.add(group)

  // light intensities are scaled for three's physically based units (r155+)
  const key = new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI)
  key.position.set(3, 4, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xbfc8ff, 0.35 * Math.PI)
  rim.position.set(-4, -2, 3)
  scene.add(rim)

  resize(800)
})

// px = canvas size in CSS px (the parent sizes it from the helix radius)
function resize(px) {
  if (!renderer) return
  const s = Math.round(px)
  const el = cv.value
  el.style.width = s + 'px'
  el.style.height = s + 'px'
  el.style.marginLeft = -s / 2 + 'px'
  el.style.marginTop = -s / 2 + 'px'
  // the canvas sits deep inside the 3D scene and is drawn smaller than its CSS size
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2) * 0.65)
  renderer.setSize(s, s, false)
  dirty = true
}

// angle in radians around the vertical axis; opacity 0..1 (intro fade)
function update(angle, opacity) {
  if (!renderer) return
  if (!dirty && angle === lastAngle && opacity === lastOpacity) return
  group.rotation.y = angle
  if (opacity !== lastOpacity) cv.value.style.opacity = opacity
  renderer.render(scene, camera)
  lastAngle = angle
  lastOpacity = opacity
  dirty = false
}

defineExpose({ resize, update })

onBeforeUnmount(() => {
  if (!renderer) return
  scene.traverse((o) => {
    if (o.geometry) o.geometry.dispose()
    if (o.material) o.material.dispose()
  })
  if (env) env.dispose()
  renderer.dispose()
})
</script>

<style scoped>
.sakura-blossom {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  pointer-events: none;
  /* cancels the world's rotateX(-6deg) so the canvas faces the viewer */
  transform: rotateX(6deg);
  animation: float 5s infinite;
  transform-origin: 50% 80%;
  will-change: transform;
}

@keyframes float {
  0% {
    transform: translate3d(0, 0, 0) rotateX(6deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.2, 1);   /* soft lift-off, slows into the peak */
  }
  50% {
    transform: translate3d(0, -5rem, 0) rotateX(8deg);
    animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);  /* smooth, slightly heavier descent */
  }
  100% {
    transform: translate3d(0, 0, 0) rotateX(6deg);
  }
}
</style>
