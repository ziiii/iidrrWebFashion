import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
 import { FBXLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js';
 import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/RGBELoader.js';

const scene= new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const sizes=(window.innerWidth,window.innerHeight);
const near=0.1;
const far=3000;

//set camera
const camera= new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight,near,far);
camera.position.set(0, 0, 300);
scene.add(camera);

//set renderer
const renderer = new THREE.WebGLRenderer({alpha:true}); 
renderer.setClearColor(0x000000); // Set backgroxsund color to black
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;//enable shadow

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0,0, 1000 );
controls.update();





//add environment FOR reflection
let envMap;
const loader=new RGBELoader();
loader.load("asset/studio_small_09_2k.hdr",function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
scene.background=texture;
envMap=texture;
applyMaterial();  //make sure the material effect is applied
});



function applyMaterial(){
const ocloader = new FBXLoader();
ocloader.load('asset/ocsilver.fbx', (object) => {
    
    object.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhysicalMaterial({
                color: 0x888888, // Base color
                metalness: 1,    // High metalness for a metallic look
                roughness: 0.05,    // Low roughness for reflectivity
                envMap: envMap,  // Apply the environment map
                envMapIntensity: 1.5, // Adjust intensity if needed
                reflectivity: 2    
            });
        }
    });
object.position.y-=200;
    scene.add(object);
});
}



const silverclawLoader = new GLTFLoader();
silverclawLoader.load('asset/silvercalw.glb', function (gltf) {
    gltf.scene.traverse(function (child) {
        // if (child.isMesh) {
        //     child.material = new THREE.MeshPhysicalMaterial({
        //         color: 0xffffff, // Base color
        //         metalness: 1,    // High metalness for a metallic look
        //         roughness: 0.05,  // Low roughness for reflectivity
        //         envMap: envMap,   // Apply the environment map
        //         envMapIntensity: 1.5, // Adjust intensity if needed
        //     });
        // }
            if (child.isMesh) {
                // Clone the existing material and update only envMap and related properties
                child.material = child.material.clone();
                child.material.envMap = envMap;  // Apply the environment map
                child.material.envMapIntensity = 1.5;  // Adjust intensity if needed
                child.material.needsUpdate = true; // Ensure the material updates with the new properties
            }

    });
    scene.add(gltf.scene);
    gltf.scene.scale.set(100, 100, 100);
    gltf.scene.position.set(30, 10, -300);
    gltf.scene.rotation.y = Math.PI / 80;
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%");
}, function (error) {
    console.error('An error occurred:', error);
});



const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const light = new THREE.SpotLight(0xffffff, 5);
light.position.set(10, 350, 150);
scene.add(light);
const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );

//ANIMATE
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
   // renderer.outputEncoding = THREE.sRGBEncoding;
    }
    
    animate();