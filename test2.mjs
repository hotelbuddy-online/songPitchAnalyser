import fs from "fs";
import wav from "wav";
import FFT from "fft-js";

function averageFrequency(audioBuffer) {
  const phasors = FFT.fft(audioBuffer);
  const frequencies = FFT.util.fftFreq(phasors, 44100); // Assuming 44.1kHz sample rate
  const amplitudes = FFT.util.fftMag(phasors);

  let totalAmplitude = 0;
  let weightedFrequencySum = 0;

  for (let i = 0; i < frequencies.length; i++) {
    totalAmplitude += amplitudes[i];
    weightedFrequencySum += frequencies[i] * amplitudes[i];
  }

  return totalAmplitude ? weightedFrequencySum / totalAmplitude : 0;
}

const file = fs.createReadStream("./c.wav");
const reader = new wav.Reader();

reader.on("format", function (format) {
  let allSamples = [];
  reader.on("data", (chunk) => {
    for (let i = 0; i < chunk.length; i += 2) {
      allSamples.push(chunk.readInt16LE(i));
    }
  });

  reader.on("end", () => {
    // Normalize the samples to [-1, 1], which is usually required for FFT processing
    const normalizedSamples = allSamples.map((sample) => sample / 32768);
    console.log("sam", normalizedSamples);
    // Calculate average frequency
    // const avgFreq = averageFrequency(normalizedSamples);
    // console.log(`Average Frequency: ${avgFreq} Hz`);
  });
});

file.pipe(reader);

export default averageFrequency;
