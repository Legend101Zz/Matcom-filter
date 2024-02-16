/// Zappar for ThreeJS Examples
/// Multiple Face Tracking 3D Models

// In this example, we track 3D models to a maximum
// of three (3) user faces

import * as ZapparThree from "@zappar/zappar-threejs";
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import snapshot from "@zappar/webgl-snapshot";
const evilMonsterModel = new URL(
  "../assets/evil_squid_sci-fi_monster.glb",
  import.meta.url
).href;
const monkeyOneModel = new URL("../assets/emoji_13.glb", import.meta.url).href;
const monkeyTwoModel = new URL("../assets/emoji_15.glb", import.meta.url).href;
const monkeyThreeModel = new URL("../assets/emoji_14.glb", import.meta.url)
  .href;
const matrixImg = new URL("../assets/matrix.png", import.meta.url).href;

import "./index.css";
// The SDK is supported on many different browsers, but there are some that
// don't provide camera access. This function detects if the browser is supported
// For more information on support, check out the readme over at
// https://www.npmjs.com/package/@zappar/zappar-threejs
if (ZapparThree.browserIncompatible()) {
  // The browserIncompatibleUI() function shows a full-page dialog that informs the user
  // they're using an unsupported browser, and provides a button to 'copy' the current page
  // URL so they can 'paste' it into the address bar of a compatible alternative.
  ZapparThree.browserIncompatibleUI();

  // If the browser is not compatible, we can avoid setting up the rest of the page
  // so we throw an exception here.
  throw new Error("Unsupported browser");
}

// Get a reference to the 'flipCamera' button so we can attach a 'click' listener
// We will create this button behaviour later on in the project
const flipCamera = document.getElementById("flipCamera");
// Get a reference to the 'snapshot' button so we can attach a 'click' listener
const snapshotButton = document.getElementById("snapshot");

snapshotButton!.addEventListener("click", () => {
  // Get canvas from dom
  const canvas =
    document.querySelector("canvas") || document.createElement("canvas");

  // Convert canvas data to url
  const url = canvas.toDataURL("image/jpeg", 0.8);

  // Take snapshot
  snapshot({
    data: url,
  });
});

// Show the flipCamera button only when the window has loaded
window.addEventListener("load", () => {
  flipCamera!.style.display = "block";
  snapshotButton!.style.display = "block";
});

// ZapparThree provides a LoadingManager that shows a progress bar while
// the assets are downloaded. You can use this if it's helpful, or use
// your own loading UI - it's up to you :-)
const manager = new ZapparThree.LoadingManager();

// Construct our ThreeJS renderer and scene as usual
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
});
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

// As with a normal ThreeJS scene, resize the canvas if the window resizes
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create a Zappar camera that we'll use instead of a ThreeJS camera
const camera = new ZapparThree.Camera();

// In order to use camera and motion data, we need to ask the users for permission
// The Zappar library comes with some UI to help with that, so let's use it
ZapparThree.permissionRequestUI().then((granted) => {
  // If the user granted us the permissions we need then we can start the camera
  // Otherwise let's them know that it's necessary with Zappar's permission denied UI
  if (granted) camera.start(true); // true parameter for user facing camera
  else ZapparThree.permissionDeniedUI();
});

// Flip the camera
let cameraRearFacing = false;
flipCamera!.addEventListener("click", () => {
  if (!cameraRearFacing) {
    camera.start(false);
    cameraRearFacing = true;
  } else {
    camera.start(true);
    cameraRearFacing = false;
  }
});

// The Zappar component needs to know our WebGL context, so set it like this:
ZapparThree.glContextSet(renderer.getContext());

// Set the background of our scene to be the camera background texture
// that's provided by the Zappar camera
scene.background = camera.backgroundTexture;

// Create a FaceTracker and a FaceAnchorGroups from it to put our Three content in
// Pass our loading manager in to ensure the progress bar works correctly
const faceTracker = new ZapparThree.FaceTrackerLoader(manager).load();
// Increase the default number of max faces
faceTracker.maxFaces = 3;
// Create anchors to track to and give them a unique ID
const faceTrackerGroup0 = new ZapparThree.FaceAnchorGroup(
  camera,
  faceTracker,
  "0"
);
const faceTrackerGroup1 = new ZapparThree.FaceAnchorGroup(
  camera,
  faceTracker,
  "1"
);
const faceTrackerGroup2 = new ZapparThree.FaceAnchorGroup(
  camera,
  faceTracker,
  "2"
);

// Add our face tracker groups into the ThreeJS scene
scene.add(faceTrackerGroup0, faceTrackerGroup1, faceTrackerGroup2);

// Load 3D models to place within our groups (using ThreeJS's GLTF loader)
// Pass our loading manager in to ensure the progress bar works correctly
const gltfLoader = new GLTFLoader(manager);

// Evil Monster
let EvilMonster: THREE.Object3D;
gltfLoader.load(
  evilMonsterModel,
  (gltf) => {
    // Assign model data into the established variable
    // so we can use it later...
    EvilMonster = gltf.scene;

    // Position the loaded content to overlay user's face
    EvilMonster.position.set(-1.5, 0, -8);
    EvilMonster.scale.set(7, 7, 7);

    // Add the scene to the first tracker group
    scene.add(EvilMonster);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the EvilMonster GLTF model");
  }
);

// See-no Monkey (monkeyOne)
let monkeyOne: THREE.Object3D;
gltfLoader.load(
  monkeyOneModel,
  (gltf) => {
    // Assign model data into the established variable
    // so we can use it later...
    monkeyOne = gltf.scene;

    // Position the loaded content to overlay user's face
    monkeyOne.position.set(0, 0.1, 0);
    monkeyOne.scale.set(38, 38, 38);

    // Prevent model from being visible at start
    monkeyOne.visible = false;

    // Add the scene to the first tracker group
    faceTrackerGroup0.add(monkeyOne);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the monkeyOne GLTF model");
  }
);

// Hear-no Monkey (monkeyTwo)
let monkeyTwo: THREE.Object3D;
gltfLoader.load(
  monkeyTwoModel,
  (gltf) => {
    // Assign model data into the established variable
    // so we can use it later...
    monkeyTwo = gltf.scene;

    // Position the loaded content to overlay user's face
    monkeyTwo.position.set(0, 0.1, 0);
    monkeyTwo.scale.set(38, 38, 38);

    // Prevent model from being visible at start
    monkeyTwo.visible = false;

    // Add the scene to the second tracker group
    faceTrackerGroup1.add(monkeyTwo);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the monkeyTwo GLTF model");
  }
);

// Speak-no Monkey (monkeyThree)
let monkeyThree: THREE.Object3D;
gltfLoader.load(
  monkeyThreeModel,
  (gltf) => {
    // Assign model data into the established variable
    // so we can use it later...
    monkeyThree = gltf.scene;

    // Position the loaded content to overlay user's face
    monkeyThree.position.set(0, 0.1, 0);
    monkeyThree.scale.set(38, 38, 38);

    // Prevent model from being visible at start
    monkeyThree.visible = false;

    // Add the scene to the third tracker group
    faceTrackerGroup2.add(monkeyThree);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the monkeyThree GLTF model");
  }
);

// ========= ADDING PLANES =========

// Create a red material with transparency
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000, // Red color
  transparent: true,
  opacity: 0.5, // Set opacity to make it transparent
});

// Create a plane geometry
const geometry = new THREE.PlaneGeometry(8, 15);

// Create a mesh with the geometry and material
const plane = new THREE.Mesh(geometry, material);
plane.position.set(-4, 0, -10);
plane.rotation.x += 0.01;

// Add the plane to the scene
scene.add(plane);

// Create a red material with transparency
const material2 = new THREE.MeshBasicMaterial({
  color: 0x0000ff, // Red color
  transparent: true,
  opacity: 0.5, // Set opacity to make it transparent
});

// Create a mesh with the geometry and material
const plane2 = new THREE.Mesh(geometry, material2);
plane2.position.set(4, 0, -10);
plane2.rotation.x += 0.01;

// Add the plane to the scene
scene.add(plane2);

// ========= Create particles=========
const particles: any = [];
const particleCount = 10000;

// Load binary texture
const textureLoader = new THREE.TextureLoader();
const binaryTexture = textureLoader.load(matrixImg);

// Function to create a particle
const createParticle = () => {
  const particle = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.01, 0.01), // Cube geometry (adjust size as needed)
    new THREE.MeshBasicMaterial({ map: binaryTexture }) // White color
  );

  // Set initial position
  particle.position.x = Math.random() * -4;
  particle.position.y = Math.random() * 5; // Start above the scene
  particle.position.z = Math.random() * 10 - 5; // Random z position

  // Add the particle to the scene
  scene.add(particle);

  return particle;
};

// Create initial particles
for (let i = 0; i < particleCount; i++) {
  particles.push(createParticle());
}

// Let's add some lighting, first a couple of directional lights...
const directionalLight1 = new THREE.DirectionalLight("white", 0.8);
const directionalLight2 = new THREE.DirectionalLight("white", 0.8);

// ...set the lights from the left and right of the scene from above...
directionalLight1.position.set(-5, 2, 0);
directionalLight2.position.set(5, 2, 0);

// ...and then make the lights look at the centre of the scene
directionalLight1.lookAt(0, 0, 0);
directionalLight2.lookAt(0, 0, 0);

// Finally, let's add the lights to our scene
scene.add(directionalLight1, directionalLight2);

// And then a little ambient light to brighten the model up a bit
const ambientLight = new THREE.AmbientLight("white", 0.8);
scene.add(ambientLight);

// Show only on the right-hand side
const rightSideThreshold = 0.295;

// When the faceTracker finds an anchor...
faceTracker.onVisible.bind((anchor) => {
  // Use logic to create behaviour based on
  // the anchor ID that is visible
  // Get the pose data
  const cameraPose = anchor.poseCameraRelative();

  // Extract the position from the pose data
  const facePosition = new THREE.Vector3();
  facePosition.fromArray(cameraPose, 12); // Assuming the position is at the 12th index

  // Check if the face is on the right-hand side
  console.log("facePosition", facePosition);
  const isOnRightSide = facePosition.x < rightSideThreshold;
  switch (anchor.id) {
    case "0": {
      // If we find an anchor with an id of 0, make it visible
      monkeyOne.visible = true;

      break;
    }
    case "1": {
      // If we find an anchor with an id of 1, make it visible
      monkeyTwo.visible = true;
      break;
    }
    case "2": {
      // If we find an anchor with an id of 2, make it visible
      monkeyThree.visible = true;
      break;
    }
    default: {
      break;
    }
  }
});

// When the faceTracker looses or cannot find an anchor...
faceTracker.onNotVisible.bind((anchor) => {
  // Use logic to create behaviour based on
  // the anchor ID that is not visible

  switch (anchor.id) {
    case "0": {
      // If we cannot find an anchor with an id of 0, make it invisible
      monkeyOne.visible = false;
      break;
    }
    case "1": {
      // If we cannot find an anchor with an id of 0, make it invisible
      monkeyTwo.visible = false;
      break;
    }
    case "2": {
      // If we cannot find an anchor with an id of 0, make it invisible
      monkeyThree.visible = false;
      break;
    }
    default: {
      break;
    }
  }
});
// Set a speed factor for the EvilMonster rotation and position updates
const rotationSpeedFactor = 0.01;
const positionSpeedFactor = 0.1;

// Use a function to render our scene as usual
function render(): void {
  // The Zappar camera must have updateFrame called every frame
  camera.updateFrame(renderer);

  // Draw the ThreeJS scene in the usual way, but using the Zappar camera
  renderer.render(scene, camera);
  // if (EvilMonster) {
  //   // Update EvilMonster properties
  //   // Adjust rotation speed
  //   EvilMonster.rotation.y += Math.random() * rotationSpeedFactor;

  //   // Adjust position speed
  //   EvilMonster.position.y = 2 * Math.sin(Math.random()) * positionSpeedFactor;
  // }
  // Update particle positions
  particles.forEach((particle: any) => {
    particle.position.y -= 0.008; // Adjust falling speed
    particle.rotation.y -= 0.001; // Adjust falling speed
    particle.rotation.y -= 0.001; // Adjust falling speed
    // Reset position if particle falls below the scene
    if (particle.position.y < -3) {
      particle.position.y = 2;
    }
  });

  // Call render() again next frame
  requestAnimationFrame(render);
}

// Start things off
render();
