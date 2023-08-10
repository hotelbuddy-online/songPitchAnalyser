const fs = require('fs');
const lamejs = require('lamejs');
const wav = require('wav-decoder');
const pitch = require('./pitch.js');

module.exports = {
    analyzeSong: async function (filePath) {
        try {
            // Read the file
            const buffer = fs.readFileSync(filePath);

            // Decode MP3 to WAV
            const mp3Decoder = new lamejs.Mp3Decoder(buffer);
            const { samples, sampleRate } = mp3Decoder.decode();

            // Results
            const detectedNotes = [];

            let currentNote = null;
            let startIndex = 0;

            for (let i = 0; i < samples.length; i++) {
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
                            end: i / sampleRate
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
                            end: i / sampleRate
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
                    end: samples.length / sampleRate
                });
            }

            return detectedNotes;
        } catch (error) {
            console.error("Error processing the audio file:", error);
            return [];
        }
    }
};
