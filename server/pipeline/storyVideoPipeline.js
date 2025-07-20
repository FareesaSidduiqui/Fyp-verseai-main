// require("dotenv").config();
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const ffmpeg = require("fluent-ffmpeg");
// const { v4: uuidv4 } = require("uuid");
// const util = require("util");
// const writeFile = util.promisify(fs.writeFile);

// const TEMP_DIR = path.join(__dirname, "../temp");
// if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// // 1. Generate Story from OpenRouter
// async function generateStory(prompt, genre, duration) {
//   try {
//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You are a creative story writer.",
//           },
//           {
//             role: "user",
//             content: `Write a ${genre} story based on this prompt: "${prompt}" lasting about ${duration} seconds.`,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("🔍 OpenRouter Response:\n", JSON.stringify(response.data, null, 2));

//     const content = response.data?.choices?.[0]?.message?.content;
//     if (!content) {
//       throw new Error("Unexpected API response structure");
//     }

//     return content;

//   } catch (err) {
//     console.error("❌ Error from OpenRouter API:", err.response?.data || err.message);
//     throw new Error("Failed to generate story");
//   }
// }

// // 2. Extract key prompts from story for images
// function extractKeyScenes(story, count = 4) {
//   const sentences = story.split(". ").filter(Boolean);
//   const interval = Math.floor(sentences.length / count);
//   const prompts = [];

//   for (let i = 0; i < count; i++) {
//     const index = i * interval;
//     if (sentences[index]) prompts.push(sentences[index].trim());
//   }

//   return prompts;
// }

// // 3. Generate image from prompt using Hugging Face
// // const axios = require('axios');
// // const fs = require('fs');
// // const path = require('path');
// const STABLE_KEY=process.env.STABLE_API_KEY


// async function generateImage(prompt, index) {
//   try {
//     const response = await axios.post(
//       "https://api.stability.ai/v2beta/stable-image/generate/sdxl-turbo",
//       {
//         prompt,
//         output_format: "png",
//         width: 512,
//         height: 512,
//         steps: 20, // Try lower (like 4-6) for faster but less sharp
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.SDXL_TURBO}`,
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         responseType: "arraybuffer", // Important to handle binary image
//       }
//     );

//     const filePath = path.join(__dirname, `image_${index}.png`);
//     fs.writeFileSync(filePath, response.data);
//     console.log(`✅ Image saved using SDXL Turbo: ${filePath}`);
//     return filePath;
//   } catch (err) {
//     console.error(`❌ SDXL Turbo image generation failed for "${prompt}":`, err.response?.data || err.message);
//     throw new Error("Failed to generate image using SDXL Turbo");
//   }
// }




// // 4. Generate audio from story using Google TTS
// async function generateTTS(storyText) {
//   const gTTS = require("gtts");
//   const gtts = new gTTS(storyText);
//   const audioPath = path.join(TEMP_DIR, `narration.mp3`);

//   await new Promise((resolve, reject) => {
//     gtts.save(audioPath, function (err) {
//       if (err) return reject(err);
//       resolve();
//     });
//   });

//   if (!fs.existsSync(audioPath)) {
//     throw new Error(`TTS audio not saved: ${audioPath}`);
//   }

//   console.log(`✅ Audio saved: ${audioPath}`);
//   return audioPath;
// }

// // 5. Stitch images and narration into a video
// async function createVideo(imagePaths, audioPath, outputName) {
//   const videoPath = path.join(TEMP_DIR, `${outputName}.mp4`);

//   return new Promise((resolve, reject) => {
//     const command = ffmpeg();

//     imagePaths.forEach((imgPath) => {
//       if (!fs.existsSync(imgPath)) {
//         console.error("❌ Missing image:", imgPath);
//       } else {
//         console.log("✅ Using image:", imgPath);
//         command.input(imgPath).loop(5); // each image for 5 sec
//       }
//     });

//     if (!fs.existsSync(audioPath)) {
//       return reject(new Error("❌ Audio file not found: " + audioPath));
//     } else {
//       console.log("✅ Using audio:", audioPath);
//     }

//     command
//       .input(audioPath)
//       .on("end", () => {
//         if (!fs.existsSync(videoPath)) {
//           return reject(new Error("❌ Video was not created"));
//         }
//         console.log(`🎬 Video created: ${videoPath}`);
//         resolve(videoPath);
//       })
//       .on("error", (err) => {
//         console.error("❌ ffmpeg error:", err.message);
//         reject(err);
//       })
//       .outputOptions([
//         "-pix_fmt yuv420p",
//         "-c:v libx264",
//         "-c:a aac",
//         "-shortest",
//       ])
//       .save(videoPath);
//   });
// }

// // 6. Main Pipeline
// async function runPipeline({ prompt, genre, duration, publicOrPrivate, userId }) {
//   try {
//     const story = await generateStory(prompt, genre, duration);
//     const keyScenes = extractKeyScenes(story);
//     const storyName = story.split(".")[0].slice(0, 60);

//     const imagePaths = [];
//     for (let i = 0; i < keyScenes.length; i++) {
//       const imgPath = await generateImage(keyScenes[i], i);
//       imagePaths.push(imgPath);
//     }

//     const thumbnail = imagePaths[0];
//     const audioPath = await generateTTS(story);

//     const videoName = uuidv4();
//     let videoPath;
//     try {
//       videoPath = await createVideo(imagePaths, audioPath, videoName);
//     } catch (err) {
//       console.error("⚠️ Video creation failed:", err.message);
//       videoPath = null;
//     }

//     return {
//       story,
//       storyName,
//       thumbnail,
//       videoPath,
//       publicOrPrivate,
//       userId,
//     };
//   } catch (err) {
//     console.error("❌ Pipeline failed:", err.message);
//     throw err;
//   }
// }

// module.exports = { runPipeline };

require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { v4: uuidv4 } = require("uuid");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const gTTS = require("gtts");

const TEMP_DIR = path.join(__dirname, "../temp");
const THUMBNAIL_DIR = path.join(__dirname, "../public/thumbnails");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
if (!fs.existsSync(THUMBNAIL_DIR)) fs.mkdirSync(THUMBNAIL_DIR);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || "https://6827-34-16-145-103.ngrok-free.app/generate";

// 1. Generate Story from OpenRouter
async function generateStory(prompt, genre, duration) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a creative story writer." },
          {
            role: "user",
            content: `Write a ${genre} story based on this prompt: "${prompt}" lasting about ${duration} seconds.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Unexpected API response structure");

    return content;
  } catch (err) {
    console.error("❌ Error from OpenRouter API:", err.response?.data || err.message);
    throw new Error("Failed to generate story");
  }
}

// 2. Extract key prompts from story for images
function extractKeyScenes(story, count = 4) {
  const sentences = story.split(". ").filter(Boolean);
  const interval = Math.floor(sentences.length / count);
  const prompts = [];

  for (let i = 0; i < count; i++) {
    const index = i * interval;
    if (sentences[index]) prompts.push(sentences[index].trim());
  }

  return prompts;
}

// 3. Generate image using Flask backend via ngrok
async function generateImage(prompt, index) {
  try {
    const response = await axios.post(
      FLASK_SERVER_URL,
      { prompt, index },
      { responseType: "arraybuffer" }
    );

    const fileName = `scene_${Date.now()}_${index}.png`;
    const filePath = path.join(THUMBNAIL_DIR, fileName);
    fs.writeFileSync(filePath, response.data);
    console.log(`✅ Image saved from Flask: ${filePath}`);

    return filePath; // return absolute path for ffmpeg
  } catch (err) {
    console.error(`❌ Flask image generation failed:`, err.message);
    throw new Error("Failed to generate image from Flask backend");
  }
}

// 4. Generate audio from story using Google TTS
async function generateTTS(storyText) {
  const gtts = new gTTS(storyText);
  const audioPath = path.join(TEMP_DIR, `narration.mp3`);

  await new Promise((resolve, reject) => {
    gtts.save(audioPath, function (err) {
      if (err) return reject(err);
      resolve();
    });
  });

  if (!fs.existsSync(audioPath)) throw new Error(`TTS audio not saved: ${audioPath}`);

  console.log(`✅ Audio saved: ${audioPath}`);
  return audioPath;
}

// 5. Stitch images and narration into a video
async function createVideo(imagePaths, audioPath, outputName) {
  const videoPath = path.join(TEMP_DIR, `${outputName}.mp4`);

  const txtListPath = path.join(TEMP_DIR, 'imglist.txt');
  const fileList = imagePaths
    .map(img => `file '${img.replace(/\\/g, "/")}'\nduration 5`)
    .join('\n') + `\nfile '${imagePaths[imagePaths.length - 1].replace(/\\/g, "/")}'`;

  fs.writeFileSync(txtListPath, fileList);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(txtListPath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .input(audioPath)
      .outputOptions([
        '-pix_fmt yuv420p',
        '-c:v libx264',
        '-c:a aac',
        '-shortest',
      ])
      .output(videoPath)
      .on('end', () => {
        console.log(`🎬 Video created: ${videoPath}`);
        resolve(videoPath);
      })
      .on('error', err => {
        console.error("❌ ffmpeg error:", err.message);
        reject(err);
      })
      .run();
  });
}

// 6. Main Pipeline
async function runPipeline({ prompt, genre, duration, publicOrPrivate, userId }) {
  try {
    const story = await generateStory(prompt, genre, duration);
    const keyScenes = extractKeyScenes(story);
    const storyName = story.split(".")[0].slice(0, 60);

    const imagePaths = [];
    for (let i = 0; i < keyScenes.length; i++) {
      const imgPath = await generateImage(keyScenes[i], i);
      imagePaths.push(imgPath);
    }

    const thumbnail = "/thumbnails/" + path.basename(imagePaths[0]);
    const audioPath = await generateTTS(story);

    const videoName = uuidv4();
    let videoPath;
    try {
      videoPath = await createVideo(imagePaths, audioPath, videoName);
    } catch (err) {
      console.error("⚠️ Video creation failed:", err.message);
      videoPath = null;
    }

    return {
      story,
      storyName,
      thumbnail,
      videoPath,
      publicOrPrivate,
      userId,
    };
  } catch (err) {
    console.error("❌ Pipeline failed:", err.message);
    throw err;
  }
}

module.exports = { runPipeline };

