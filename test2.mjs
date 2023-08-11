import fs from "fs/promises";
import decode from "audio-decode";
import FFT from "fft-js";

function averageFrequency(samples) {
  //   const phasors = FFT.fft(samples);
  //   const frequencies = FFT.util.fftFreq(phasors, 44100); // Assuming 44.1kHz sample rate
  //   const amplitudes = FFT.util.fftMag(phasors);
  //   let totalAmplitude = 0;
  //   let weightedFrequencySum = 0;
  //   for (let i = 0; i < frequencies.length; i++) {
  //     totalAmplitude += amplitudes[i];
  //     weightedFrequencySum += frequencies[i] * amplitudes[i];
  //   }
  //   return totalAmplitude ? weightedFrequencySum / totalAmplitude : 0;
}

async function analyzeAudioFile(filepath, startSeconds, durationSeconds) {
  try {
    const buffer = await fs.readFile(filepath);

    const audioBuffer = await decode(buffer);

    if (!audioBuffer) {
      console.error("Decoding failed or resulted in an empty AudioBuffer.");
      return;
    }

    if (typeof audioBuffer.getChannelData !== "function") {
      console.error("Decoding failed or resulted in no channel data.");
      return;
    }
    const data = audioBuffer.getChannelData(0);
    console.log("gc 0", data);

    const sampleRate = audioBuffer.sampleRate;
    const startSample = startSeconds * sampleRate;
    const endSample = startSample + durationSeconds * sampleRate;

    // Assuming the audio is mono for simplicity
    const samples = data.slice(startSample, endSample);
    console.log("samples", samples);

    const avgFreq = averageFrequency(samples);
    // console.log(`Average Frequency: ${avgFreq} Hz`);
  } catch (err) {
    console.error(err);
  }
}

// Example usage:
analyzeAudioFile("./c mono.wav", 0, 2); // Analyzes from 10s to 15s
