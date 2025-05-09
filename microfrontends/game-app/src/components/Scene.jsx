import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import addGameToScene from "../game/game";

import { useMutation, useLazyQuery } from "@apollo/client";
import { GET_GAME_PROGRESS } from "../graphql/queries";
import { UPDATE_GAME_PROGRESS } from "../graphql/mutations";

export default ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady,
  userData,
  isLoggedIn,
  ...rest
}) => {
  const reactCanvas = useRef(null);

  //GraphQL queries
  const pointsPerLevel = 100;

  const [getGameProgress] = useLazyQuery(GET_GAME_PROGRESS, {
    variables: { userId: userData?.id },
    skip: !userData?.id,
  });
  const [updateGameProgress] = useMutation(UPDATE_GAME_PROGRESS, {});

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    );
    const scene = new Scene(engine, sceneOptions);
    addGameToScene(canvas, scene);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    const handleLevelChanged = async (event) => {
      console.log("handleLevelChanged");
      const levelNumber = event.detail.levelNumber;
      const { data } = await getGameProgress();
      console.log("getGameProgress", data);
      const achievements = data?.gameProgressByUserId.achievements || [];
      const newAchievements = [...achievements];
      const currentScore = parseInt(data?.gameProgressByUserId.score) || 0;
      const currentExperiencePoints =
        parseInt(data?.gameProgressByUserId.experiencePoints) || 0;
      const isSameLevel =
        data?.gameProgressByUserId.progress === "Level " + levelNumber;

      if (
        levelNumber === 1 &&
        data?.gameProgressByUserId.progress === "Level 3" &&
        !newAchievements.includes("Champion Racer")
      ) {
        newAchievements.push("Champion Racer");
      }
      if (levelNumber === 2 && !newAchievements.includes("Track Starter")) {
        newAchievements.push("Track Starter");
      }
      if (levelNumber === 3 && !newAchievements.includes("Road Warrior")) {
        newAchievements.push("Road Warrior");
      }

      updateGameProgress({
        variables: {
          userId: userData.id,
          experiencePoints: !isSameLevel
            ? currentExperiencePoints + pointsPerLevel
            : currentExperiencePoints,
          score: !isSameLevel ? currentScore + pointsPerLevel : currentScore,
          progress: "Level " + levelNumber,
          lastPlayed: new Date().toISOString(),
          achievements: newAchievements,
        },
      });
      // setLevelNumber(event.detail.levelNumber);
    };

    if (window) {
      window.addEventListener("resize", resize);
      //GraphQL queries
      window.addEventListener("levelChanged", handleLevelChanged);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
        window.removeEventListener("levelChanged", handleLevelChanged);
      }
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
  ]);

  if (!isLoggedIn) {
    return null;
  }

  return <canvas ref={reactCanvas} {...rest} />;
};
