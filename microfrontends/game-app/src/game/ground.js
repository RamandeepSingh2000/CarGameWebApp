import { MeshBuilder, PhysicsImpostor } from "@babylonjs/core";
import { addPhysicsImposterToMesh } from "./physics";
export default function createGround(scene) {
  // Create a ground mesh with a width and height of 6 units
  var ground = MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );

  ground.isVisible = false;
  addPhysicsImposterToMesh(ground, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.5,
    friction: 0.5,
  });
  // Return the created ground mesh
  return ground;
}
