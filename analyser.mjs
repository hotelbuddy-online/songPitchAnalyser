import FFT from "fft-js";

function averageFrequency(audioBuffer) {
  // Compute the FFT
  const phasors = FFT.fft(audioBuffer);
  const frequencies = FFT.util.fftFreq(phasors, 44100); // assuming a sample rate of 44100Hz
  const amplitudes = FFT.util.fftMag(phasors);

  let totalAmplitude = 0;
  let weightedFrequencySum = 0;

  for (let i = 0; i < frequencies.length; i++) {
    totalAmplitude += amplitudes[i];
    weightedFrequencySum += frequencies[i] * amplitudes[i];
    console.log("wf", weightedFrequencySum);
  }

  return totalAmplitude ? weightedFrequencySum / totalAmplitude : 0;
}

export default averageFrequency;
