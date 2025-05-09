import { CreateAudioEngineAsync, CreateSoundAsync } from "@babylonjs/core";
const port = import.meta.env.VITE_PORT || 5173;
const baseURL = `http://localhost:${port}`;

export default async function addAudioToScene(scene) {
    const audioEngine = await CreateAudioEngineAsync();
    const music = await CreateSoundAsync("gunshot",
        `${baseURL}/music.mp3`
    );
    audioEngine.unlock().then(() => {
        music.loop = true;
    music.play();
    });    
}