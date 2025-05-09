import {
  Color3,
  ImportMeshAsync,
  MeshBuilder,
  PhysicsImpostor,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";

let trackMesh = null;
let ground = null;
let finishTarget = null;
let loading = false;
const port = import.meta.env.VITE_PORT || 5173;
const baseURL = `http://localhost:${port}`;
export async function createTrack1(scene) {
  var model = await ImportMeshAsync(`${baseURL}/M_track_1.glb`, scene);
  var mesh = model.meshes[0];
  var scale = 10;
  mesh.position = new Vector3(0, 0, 0);
  mesh.scaling = new Vector3(1, 1, 1).scale(0.7 * scale);
  ground = MeshBuilder.CreateGroundFromHeightMap(
    "track_1",
    `${baseURL}/H_track_1.jpeg`,
    {
      width: 30 * scale,
      height: 30 * scale,
      subdivisions: 500,
      minHeight: 0,
      maxHeight: 10,
      onReady: (mesh) => {
        mesh.physicsImposter = new PhysicsImpostor(
          mesh,
          PhysicsImpostor.HeightmapImpostor,
          { mass: 0, restitution: 0, friction: 0.001 }
        );
      },
    },
    scene
  );
  ground.visibility = false;
  mesh.parent = ground;
  return mesh;
}

export async function createTrack2(scene) {
  var model = await ImportMeshAsync(`${baseURL}/M_track_2.glb`, scene);
  var mesh = model.meshes[0];
  var scale = 10;
  mesh.position = new Vector3(0, 0, 0);
  mesh.scaling = new Vector3(1.35, 1.8, 1).scale(0.8 * scale);
  ground = MeshBuilder.CreateGroundFromHeightMap(
    "track_2",
    `${baseURL}/H_track_2.jpeg`,
    {
      width: 30 * scale,
      height: 30 * scale,
      subdivisions: 500,
      minHeight: 0,
      maxHeight: 10,
      onReady: (mesh) => {
        mesh.physicsImposter = new PhysicsImpostor(
          mesh,
          PhysicsImpostor.HeightmapImpostor,
          { mass: 0, restitution: 0, friction: 0.001 }
        );
      },
    },
    scene
  );
  ground.visibility = false;
  mesh.parent = ground;
  return mesh;
}

export async function createTrack3(scene) {
  var model = await ImportMeshAsync(`${baseURL}/M_track_3.glb`, scene);
  var mesh = model.meshes[0];
  var scale = 10;
  mesh.position = new Vector3(0, 6, 0);
  mesh.scaling = new Vector3(1, 1, 1).scale(3 * scale);
  ground = MeshBuilder.CreateGroundFromHeightMap(
    "track_3",
    `${baseURL}/H_track_3.jpeg`,
    {
      width: 30 * scale,
      height: 30 * scale,
      subdivisions: 500,
      minHeight: 0,
      maxHeight: 10,
      onReady: (mesh) => {
        mesh.physicsImposter = new PhysicsImpostor(
          mesh,
          PhysicsImpostor.HeightmapImpostor,
          { mass: 0, restitution: 0, friction: 0.001 }
        );
      },
    },
    scene
  );
  ground.visibility = false;
  mesh.parent = ground;
  return mesh;
}

export async function loadLevel1(scene, car) {
  loading = true;
  if (trackMesh) {
    trackMesh.dispose();
    trackMesh = null;
  }
  if (ground) {
    ground.physicsImposter.dispose();
    ground.dispose();
    ground = null;
  }
  trackMesh = await createTrack1(scene);
  ground = trackMesh.parent;

  car.forceSetPositionAndRotation(new Vector3(-31.8, 5, 25.8), 2.25);
  await addFinishTarget(scene, new Vector3(-119, 4, -8.7), car, async () => {
    if (loading) {
      return;
    }
    console.log("Finish line reached!");
    await loadLevel2(scene, car);
  });
  triggerLevelChange(1);
  loading = false;
}

export async function loadLevel2(scene, car) {
  loading = true;
  if (trackMesh) {
    trackMesh.dispose();
    trackMesh = null;
  }
  if (ground) {
    ground.physicsImposter.dispose();
    ground.dispose();
    ground = null;
  }
  trackMesh = await createTrack2(scene);
  ground = trackMesh.parent;

  car.forceSetPositionAndRotation(new Vector3(50, 20, -54.8), 2.25);
  await addFinishTarget(
    scene,
    new Vector3(75.7, 0.86, 52.28),
    car,
    async () => {
      if (loading) {
        return;
      }
      console.log("Finish line reached!");
      await loadLevel3(scene, car);
    }
  );
  triggerLevelChange(2);
  loading = false;
}
export async function loadLevel3(scene, car) {
  loading = true;
  if (trackMesh) {
    trackMesh.position = new Vector3(0, -100, 0);
    trackMesh.dispose();
    trackMesh = null;
  }
  if (ground) {
    ground.physicsImposter.dispose();
    ground.dispose();
    ground = null;
  }
  trackMesh = await createTrack3(scene);
  ground = trackMesh.parent;

  car.forceSetPositionAndRotation(new Vector3(-82.6, 10, 72.7), 2.25);
  await addFinishTarget(
    scene,
    new Vector3(-21.9, 0.86, 101.5),
    car,
    async () => {
      if (loading) {
        return;
      }
      console.log("Finish line reached!");
      await loadLevel1(scene, car);
    }
  );
  triggerLevelChange(3);
  loading = false;
}

async function addFinishTarget(scene, position, car, onCollide) {
  if (!finishTarget) {
    var mesh = MeshBuilder.CreateBox(
      "finish",
      { height: 10, width: 10, depth: 10 },
      scene
    );
    mesh.material = new StandardMaterial("finishMaterial", scene);
    mesh.material.diffuseColor = new Color3(1, 1, 0); // Yellow color
    mesh.physicsImpostor = new PhysicsImpostor(
      mesh,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0, friction: 0.001 }
    );
    finishTarget = mesh;
  }

  finishTarget.position = position;
  finishTarget.physicsImpostor.registerOnPhysicsCollide(
    car.mesh.physicsImpostor,
    onCollide
  );
}

function triggerLevelChange(levelNumber) {
  window.dispatchEvent(
    new CustomEvent("levelChanged", {
      detail: { levelNumber: levelNumber },
    })
  );
}
