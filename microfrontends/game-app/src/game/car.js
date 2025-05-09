import {
  ImportMeshAsync,
  Mesh,
  PhysicsBody,
  PhysicsImpostor,
  PhysicsMotionType,
  Space,
  Vector3,
} from "@babylonjs/core";
import { addPhysicsImposterToMesh } from "./physics.js";
import { Quaternion } from "cannon";
const port = import.meta.env.VITE_PORT || 5173;
const baseURL = `http://localhost:${port}`;

export default async function createCar(scene, keyboardMap) {
  const model = await ImportMeshAsync(`${baseURL}/M_car.gltf`, scene);
  const mesh = Mesh.MergeMeshes(
    model.meshes.filter((m) => m.getVerticesDataKinds().length > 0),
    true,
    false,
    undefined,
    false,
    true
  );
  addPhysicsImposterToMesh(mesh, PhysicsImpostor.BoxImpostor, {
    mass: 1,
    friction: 0.005,
    restitution: 0,
  });

  return {
    mesh: mesh,
    map: keyboardMap,
    forceSetPositionAndRotation: forceSetPositionAndRotation,
    update: carUpdate,
  };
}

function forceSetPositionAndRotation(position, rotation) {
  this.mesh.physicsImpostor.dispose();
  this.mesh.position = position;
  this.mesh.rotation = Vector3.Zero();
  addPhysicsImposterToMesh(this.mesh, PhysicsImpostor.BoxImpostor, {
    mass: 1,
    friction: 0.005,
    restitution: 0,
  });
  this.mesh.physicsImpostor.setDeltaRotation(
    new Vector3(0, rotation, 0).toQuaternion()
  );
}

function carUpdate() {
  var map = this.map;
  var car = this.mesh;
  //console.log(car.position, car.rotation);
  const force = 60;
  car.rotation = new Vector3(0, car.rotation.y, 0); // Reset rotation to Y axis only
  if (map["a"]) {
    car.rotation = new Vector3(0, car.rotation.y - 0.01, 0); // Rotate the car left
  }
  if (map["d"]) {
    car.rotation = new Vector3(0, car.rotation.y + 0.01, 0); // Rotate the car right
  }
  if (map["w"]) {
    car.physicsImpostor.applyForce(
      car.getDirection(Vector3.Forward()).scale(force),
      car.getAbsolutePosition()
    ); // Move the car forward
  }
  if (map["s"]) {
    car.physicsImpostor.applyForce(
      car.getDirection(Vector3.Backward()).scale(force),
      car.getAbsolutePosition()
    ); // Move the car backward
  }
}
