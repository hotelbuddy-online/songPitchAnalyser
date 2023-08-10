import fs from "fs";
import lamejs from "lamejs";
import decodeAudio from "audio-decode";
// import buffer from 'audio-lena/mp3';
// import wav from 'wav-decoder';
import PitchAnalyzer from "./pitch.js";

async function PitchAnalyzer(filePath) {
  try {
    let audioBuffer = await decode(buffer);
    const { samples, sampleRate } = mp3Decoder.decode();

    // Results
    const detectedNotes = [];

    let currentNote = null;
    let startIndex = 0;

    var pitch = new PitchAnalyzer(audioBuffer.sampleRate);

    for (let i = 0; i < samples.length; i++) {
      // Copy samples to the internal buffer
      pitch.input(audioBuffer);

      // Process the current input in the internal buffer
      pitch.process();
      const detectedPitch = pitch(samples[i], sampleRate);
      if (detectedPitch && detectedPitch.note) {
        if (!currentNote) {
          // Begin a new note sequence
          currentNote = detectedPitch.note;
          startIndex = i;
        } else if (currentNote !== detectedPitch.note) {
          // End the current note sequence and begin a new one
          detectedNotes.push({
            note: currentNote,
            start: startIndex / sampleRate,
            end: i / sampleRate,
          });
          currentNote = detectedPitch.note;
          startIndex = i;
        }
      } else {
        // If there's no pitch detected and we're in a sequence, end it
        if (currentNote) {
          detectedNotes.push({
            note: currentNote,
            start: startIndex / sampleRate,
            end: i / sampleRate,
          });
          currentNote = null;
        }
      }
    }

    // If we end with a sequence, make sure to add it
    if (currentNote) {
      detectedNotes.push({
        note: currentNote,
        start: startIndex / sampleRate,
        end: samples.length / sampleRate,
      });
    }

    return detectedNotes;
  } catch (error) {
    console.error("Error processing the audio file:", error);
    return [];
  }
}

export default PitchAnalyzer;
