import {
  FollowCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  DeviceSourceManager,
  DeviceType,
} from "@babylonjs/core";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
import createCar from "./car";
import createFollowCamera from "./camera";
import createKeyboardMap from "./keyboardMap";
import { addPhysicsToScene } from "./physics";
import { loadLevel1, loadLevel2, loadLevel3 } from "./levelProvider";
import addAudioToScene from "./audio";
registerBuiltInLoaders();

export default async function addGameToScene(canvas, scene) {
  addAudioToScene(scene);
  addPhysicsToScene(scene);
  const camera = await createFollowCamera(canvas, scene);
  const keyboardMap = createKeyboardMap(scene);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  light.intensity = 0.7;

  let car = await createCar(scene, keyboardMap);
  camera.lockedTarget = car.mesh;
  camera.rotationOffset = 180;
  await loadLevel1(scene, car);
  scene.onBeforeRenderObservable.add(() => {
    if (!car.mesh) {
      return;
    }
    car.update();
  });

  return scene;
}
