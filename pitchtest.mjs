import fs from "fs";
import decode from "audio-decode";
import PitchAnalyzer from "./pitch.js";

function analyzeAudioFile(filePath) {
  return new Promise(async (resolve, reject) => {
    try {
      // Read the file into a buffer
      console.log("file", filePath);
      const buffer = await fs.promises.readFile(filePath);

      // Decode the audio data into an audioBuffer
      const audioBuffer = await decode(buffer);
      console.log("sample rate", audioBuffer.sampleRate);
      // Create a new pitch detector
      var pitch = new PitchAnalyzer(audioBuffer.sampleRate);

      // Copy samples to the internal buffer
      pitch.input(audioBuffer);

      // Process the current input in the internal buffer
      pitch.process();

      const tone = pitch.findTone();

      if (tone === null) {
        resolve({ message: "No tone found!" });
      } else {
        resolve({
          message: "Tone found",
          frequency: tone.freq,
          volume: tone.db,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
}

// Example usage
analyzeAudioFile("./c.ogg")
  .then((result) => {
    if (result.message === "Tone found") {
      console.log(
        "Found a tone, frequency:",
        result.frequency,
        "volume:",
        result.volume
      );
    } else {
      console.log(result.message);
    }
  })
  .catch((err) => {
    console.error("Error occurred:", err);
  });

export default analyzeAudioFile;
