import { CannonJSPlugin, PhysicsImpostor, Vector3 } from "@babylonjs/core";
import * as cannon from "cannon";

export function addPhysicsToScene(scene) {
  window.CANNON = cannon;
  scene.enablePhysics(new Vector3(0, -9.81 * 10, 0), new CannonJSPlugin());
}

export function addPhysicsImposterToMesh(mesh, type, options) {
  mesh.physicsImpostor = new PhysicsImpostor(mesh, type, options);
}
