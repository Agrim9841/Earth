// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  pixelsPerInch: 300,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set( 0, 0, -2.5 );
  camera.lookAt(new THREE.Vector3());

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const loader = new THREE.TextureLoader();

  // Setup star material
  const startexture = loader.load("8k_stars.jpg");
  const starmaterial = new THREE.MeshBasicMaterial({
    map: startexture,
    side: THREE.BackSide,
  });

  // Setup a mesh with geometry + material
  const star = new THREE.Mesh(geometry, starmaterial);
  star.scale.setScalar(40);
  scene.add(star);

  const earthtexture = loader.load("8k_earth_daymap.jpg");
  // const earthNormalMap = loader.load("8k_earth_normal_map.tif");
  const earthmaterial = new THREE.MeshStandardMaterial({
    map: earthtexture,
    // normalMap: earthNormalMap,
    // normalScale: new THREE.Vector2(1, 1),
    roughness: 1,
    metalness: 0,
  });

  const earth = new THREE.Mesh(geometry, earthmaterial);
  earth.rotation.y = 5;
  scene.add(earth);

  const skytexture = loader.load("8k_earth_clouds.jpg");
  const skymaterial = new THREE.MeshStandardMaterial({
    map: skytexture,
  });
  skymaterial.blending= THREE.AdditiveBlending;

  const sky = new THREE.Mesh(geometry, skymaterial);
  sky.scale.setScalar(1.005);
  scene.add(sky);

  const pointLight = new THREE.PointLight( 'white', 0.5, 100 );
  pointLight.position.set( -5, 2, -5 );
  scene.add( pointLight );

  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  scene.add( pointLightHelper );

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      let speed = time/50;
      earth.rotation.y = speed;
      sky.rotation.y = speed*1.5;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
