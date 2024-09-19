//import * as THREE from 'three';
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

//set scene
const scene= new THREE.Scene();
const sizes=(window.innerWidth,window.innerHeight);
const near=0.1;
const far=3000;

//set camera
const camera= new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight,near,far);
camera.position.set(0, 0, 400);
scene.add(camera);

//set renderer
const renderer = new THREE.WebGLRenderer({alpha:true}); 
renderer.setClearColor(0x000000); // Set backgroxsund color to black
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.body.appendChild(renderer.domElement);


//set load
    const fbxLoader = new FBXLoader();
    let character;
    let mixer;
    let animations={};
    let clipLoaded=0;
    let clipNumber=2;

    fbxLoader.load('asset/rig_cyborg_t.fbx', function (fbxCharacter) {
        character = fbxCharacter;
        scene.add(character);
    
    
            // Set up the AnimationMixer
            mixer = new THREE.AnimationMixer(character);


            fbxLoader.load('asset/Catwalk Walk Forward_inplace.fbx', function (fbxAnimation) {
                const walkAnimation = fbxAnimation.animations[0];
                animations.walk = mixer.clipAction(walkAnimation);
                clipLoaded++;
                console.log(clipLoaded);
                 //TWICE
                //animations.walk.play();
            
            });
        
            fbxLoader.load('asset/Catwalk Walk Stop Twist R.fbx', function (fbxAnimation) {
                const stopAnimation = fbxAnimation.animations[0];
                animations.stop = mixer.clipAction(stopAnimation);
                clipLoaded++;
                console.log(clipLoaded);
                if(clipLoaded==clipNumber){
                    playSequence();
                }
              
            });

            
            
    });

  function playSequence(){
       animations.walk.setLoop(THREE.LoopRepeat, 2);
        animations.walk.play();
        animations.walk.getMixer().addEventListener('finished', function () {
            animations.stop.play();
        });
    }

//ORBIT controls
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0,0, 1000 );
controls.update();


//set lighting
const light = new THREE.AmbientLight( 0x404040,3 ); // soft white light
scene.add( light );

const followLight = new THREE.PointLight(0xffffff, 10, 300);  // Color, intensity, and distance
followLight.position.set(0, 10, 0);  // Set initial position above the character (adjust as needed)
scene.add(followLight);  // Add the light to the scene

// Add a helper to visualize the light (optional)
const lightHelper = new THREE.PointLightHelper(followLight, 1);  // Adjust size of the helper
scene.add(lightHelper);


//move forward while walking
let clock = new THREE.Clock();  // Create a clock to track delta time
let walkspeed = 0;  // Adjust this value to control how fast the character moves forward

//ANIMATE
function animate(){
requestAnimationFrame(animate);
controls.update();



if (mixer) {
     let delta = clock.getDelta();  // Get the time passed since the last frame
    mixer.update(delta); 
      //console.log(delta);
     // Check if the walking animation is playing
    // character.position.z += walkspeed * delta*10;  // Move the character forward along the z-axis
     character.position.z+=walkspeed;
     followLight.position.set(character.position.x, character.position.y + 300, character.position.z); 
}
renderer.render(scene, camera);

}


animate();