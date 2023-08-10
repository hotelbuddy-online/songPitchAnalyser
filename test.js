const musicAnalyzer = require('./musicAnalyzerModule.mjs');

const filePath = './vocals.mp3';
const bpm = 120; // for example
const startTime = 0; // if you want to set another start time, change this

musicAnalyzer.analyzeSong(filePath, bpm, startTime).then((detectedNotes) => {
    console.log(detectedNotes);
});
