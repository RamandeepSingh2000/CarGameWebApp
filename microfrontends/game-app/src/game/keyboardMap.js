import { ActionManager, ExecuteCodeAction } from "@babylonjs/core";
export default function createKeyboardMap(scene) {
  var map = {};
  scene.actionManager = new ActionManager(scene);

  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    })
  );

  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    })
  );

  return map;
}
