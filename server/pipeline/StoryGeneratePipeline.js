// // // const fs = require("fs");
// // // const path = require("path");
// // // const { exec } = require("child_process");
// // // const axios = require("axios");
// // // const { createWriteStream } = require("fs");
// // // const gTTS = require("gtts");
// // // const ffmpeg = require("fluent-ffmpeg");

// // // const dalleApiKey = process.env.OPENAI_API_KEY;
// // // const openRouterApiKey = process.env.OPENROUTER_API_KEY;
// // // const tmpDir = path.join(__dirname, "temp");
// // // if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

// // // function getImageCount(duration) {
// // //   if (duration <= 30) return 2;
// // //   if (duration <= 60) return 4;
// // //   if (duration <= 120) return 5;
// // //   if (duration <= 180) return 6;
// // //   if (duration <= 240) return 7;
// // //   return 8;
// // // }

// // // function generateStory(prompt, genre, duration) {
// // //   console.log(`📜 Generating story for prompt: "${prompt}" | Genre: "${genre}" | Duration: ${duration}s`);
// // //   const tokens = duration <= 30 ? 100 : duration <= 60 ? 200 : 300;
// // //   return axios.post("https://openrouter.ai/api/v1/chat/completions", {
// // //     model: "openai/gpt-3.5-turbo",
// // //     messages: [{ role: "user", content: `Write a ${genre} story in ${duration} seconds based on: ${prompt}` }],
// // //     max_tokens: tokens,
// // //   }, {
// // //     headers: { Authorization: `Bearer ${openRouterApiKey}` },
// // //   }).then(res => res.data.choices[0].message.content);
// // // }

// // // function extractScenes(story, imageCount) {
// // //   console.log(`📌 Extracting ${imageCount} key scenes from story...`);
// // //   return axios.post("https://openrouter.ai/api/v1/chat/completions", {
// // //     model: "openai/gpt-3.5-turbo",
// // //     messages: [{ role: "user", content: `Extract ${imageCount} key scenes from this story for illustration:\n\n${story}` }],
// // //   }, {
// // //     headers: { Authorization: `Bearer ${openRouterApiKey}` },
// // //   }).then(res => res.data.choices[0].message.content.split("\n").filter(Boolean));
// // // }

// // // function sanitizePrompt(prompt) {
// // //   return prompt
// // //     .replace(/^(\d+\.\s*)?/, "") // remove list numbers
// // //     .replace(/surgery|injured|critically|terminally|ill|death|dying/gi, "medical care")
// // //     .replace(/patient/gi, "person")
// // //     .replace(/comforting/gi, "talking to")
// // //     .replace(/breakthrough discovery/gi, "important scientific discovery")
// // //     .replace(/operating room/gi, "modern hospital room");
// // // }


// // // async function generateImage(prompt, index) {
// // //   const safePrompt = sanitizePrompt(prompt);
// // //   console.log(`🖼️ Generating image ${index + 1}: "${safePrompt}"`);
// // //   const imagePath = path.join(tmpDir, `image_${index}.png`);
// // //   const url = "https://api.openai.com/v1/images/generations";

// // //   for (let attempt = 1; attempt <= 3; attempt++) {
// // //     try {
// // //       const response = await axios.post(
// // //         url,
// // //         {
// // //           model: "dall-e-3",
// // //           prompt: safePrompt,
// // //           n: 1,
// // //           size: "1024x1024",
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${dalleApiKey}`,
// // //           },
// // //         }
// // //       );

// // //       const imageUrl = response.data.data[0].url;
// // //       const writer = createWriteStream(imagePath);
// // //       const imageStream = await axios.get(imageUrl, { responseType: "stream" });
// // //       imageStream.data.pipe(writer);
// // //       await new Promise((resolve) => writer.on("finish", resolve));
// // //       console.log(`✅ Image ${index + 1} saved to ${imagePath}`);
// // //       return imagePath;

// // //     } catch (error) {
// // //       console.error(`❌ Error generating image ${index + 1} (attempt ${attempt}):`, error?.message || error);
// // //       if (attempt === 3) throw new Error(`🚨 Failed to generate image ${index + 1} after 3 attempts.`);
// // //       await new Promise(resolve => setTimeout(resolve, 2000)); // wait before retry
// // //     }
// // //   }
// // // }



// // // function addBlurredPadding(inputPath, outputPath) {
// // //   return new Promise((resolve, reject) => {
// // //     console.log(`🌀 Adding blurred padding to ${inputPath}`);
// // //     const cmd = `ffmpeg -y -i "${inputPath}" -filter_complex "[0:v]scale=720:720,boxblur=luma_radius=min(h\\,w)/20:luma_power=1[blur];[blur][0:v]overlay=(W-w)/2:(H-h)/2" "${outputPath}"`;
// // //     exec(cmd, (err) => {
// // //       if (err) {
// // //         console.error("❌ FFmpeg padding error:", err);
// // //         reject(err);
// // //       } else {
// // //         console.log(`✨ Padded image saved to ${outputPath}`);
// // //         resolve(outputPath);
// // //       }
// // //     });
// // //   });
// // // }

// // // function generateTTS(text, outputPath) {
// // //   console.log("🔊 Generating TTS audio...");
// // //   return new Promise((resolve, reject) => {
// // //     const gtts = new gTTS(text, 'en');
// // //     gtts.save(outputPath, function (err) {
// // //       if (err) {
// // //         console.error("❌ TTS error:", err);
// // //         return reject(err);
// // //       }
// // //       console.log(`✅ Audio saved to ${outputPath}`);
// // //       resolve(outputPath);
// // //     });
// // //   });
// // // }

// // // function generateVideo(imagePaths, audioPath, outputPath) {
// // //   console.log("🎬 Starting video generation...");
// // //   return new Promise((resolve, reject) => {
// // //     const ffmpegCmd = ffmpeg();
// // //     imagePaths.forEach(p => ffmpegCmd.input(p));
// // //     ffmpegCmd
// // //       .input(audioPath)
// // //       .on("end", () => {
// // //         console.log(`🎉 Video generated at ${outputPath}`);
// // //         resolve(outputPath);
// // //       })
// // //       .on("error", (err) => {
// // //         console.error("❌ Video generation error:", err);
// // //         reject(err);
// // //       })
// // //       .outputOptions("-r" ,"1", "-pix_fmt", " yuv420p")
// // //       .output(outputPath)
// // //       .run();
// // //   });
// // // }

// // // async function runPipeline({ prompt, genre, duration }) {
// // //   const story = await generateStory(prompt, genre, duration);
// // //   console.log("📖 Story content:\n", story);

// // //   const imageCount = getImageCount(duration);
// // //   const scenes = await extractScenes(story, imageCount);
// // //   console.log("🗂️ Key scenes extracted:\n", scenes);

// // //   const imagePaths = [];
// // //   for (let i = 0; i < scenes.length; i++) {
// // //     const rawPath = await generateImage(scenes[i], i);
// // //     const paddedPath = path.join(tmpDir, `padded_image_${i}.png`);
// // //     await addBlurredPadding(rawPath, paddedPath);
// // //     imagePaths.push(paddedPath);
// // //     await new Promise(resolve => setTimeout(resolve, 1500)); // delay to reduce API load

// // //   }

// // //   const audioPath = path.join(tmpDir, "story.mp3");
// // //   await generateTTS(story, audioPath);

// // //   const videoPath = path.join(tmpDir, "story_video.mp4");
// // //   await generateVideo(imagePaths, audioPath, videoPath);

// // //   const title = `Story_${Date.now()}`;
// // //   const thumbnail = imagePaths[0];

// // //   return {
// // //     video: videoPath,
// // //     title,
// // //     thumbnail,
// // //     story,
// // //   };
// // // }

// // // module.exports = { runPipeline };
// // require("dotenv").config();
// // const axios = require("axios");
// // const fs = require("fs");
// // const path = require("path");
// // const ffmpeg = require("fluent-ffmpeg");
// // const { v4: uuidv4 } = require("uuid");
// // const util = require("util");
// // const writeFile = util.promisify(fs.writeFile);

// // const TEMP_DIR = path.join(__dirname, "../temp");
// // if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// // const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// // const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // // 1. Generate Story from OpenRouter
// // async function generateStory(prompt, genre, duration) {
// //   try {
// //     const response = await axios.post(
// //       "https://openrouter.ai/api/v1/chat/completions",
// //       {
// //         model: "openai/gpt-3.5-turbo",
// //         messages: [
// //           {
// //             role: "system",
// //             content: "You are a creative story writer.",
// //           },
// //           {
// //             role: "user",
// //             content: `Write a ${genre} story based on this prompt: "${prompt}" lasting about ${duration} seconds.`,
// //           },
// //         ],
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );

// //     const content = response.data?.choices?.[0]?.message?.content;
// //     if (!content) throw new Error("Unexpected API response structure");

// //     return content;
// //   } catch (err) {
// //     console.error("❌ Error from OpenRouter API:", err.response?.data || err.message);
// //     throw new Error("Failed to generate story");
// //   }
// // }

// // // 2. Extract key prompts from story
// // function extractKeyScenes(story, count = 4) {
// //   const sentences = story.split(". ").filter(Boolean);
// //   const interval = Math.floor(sentences.length / count);
// //   const prompts = [];

// //   for (let i = 0; i < count; i++) {
// //     const index = i * interval;
// //     if (sentences[index]) prompts.push(sentences[index].trim());
// //   }

// //   return prompts;
// // }

// // // 3. Generate image using DALL·E 3
// // async function generateImage(prompt, index) {
// //   try {
// //     const response = await axios.post(
// //       "https://api.openai.com/v1/images/generations",
// //       {
// //         model: "dall-e-3",
// //         prompt: prompt,
// //         n: 1,
// //         size: "1024x1024",
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${OPENAI_API_KEY}`,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );

// //     const imageUrl = response.data?.data?.[0]?.url;
// //     if (!imageUrl) throw new Error("Image URL not found in DALL·E response");

// //     const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

// //     const filePath = path.join(TEMP_DIR, `image_${index}.png`);
// //     fs.writeFileSync(filePath, imageResponse.data);
// //     console.log(`✅ DALL·E image saved: ${filePath}`);
// //     return filePath;
// //   } catch (err) {
// //     console.error(`❌ DALL·E image generation failed for "${prompt}":`, err.response?.data || err.message);
// //     throw new Error("Failed to generate image using DALL·E");
// //   }
// // }

// // // 4. Generate audio from story using Google TTS
// // async function generateTTS(storyText) {
// //   const gTTS = require("gtts");
// //   const gtts = new gTTS(storyText);
// //   const audioPath = path.join(TEMP_DIR, `narration.mp3`);

// //   await new Promise((resolve, reject) => {
// //     gtts.save(audioPath, function (err) {
// //       if (err) return reject(err);
// //       resolve();
// //     });
// //   });

// //   if (!fs.existsSync(audioPath)) {
// //     throw new Error(`TTS audio not saved: ${audioPath}`);
// //   }

// //   console.log(`✅ Audio saved: ${audioPath}`);
// //   return audioPath;
// // }

// // // 5. Stitch images and narration into a video
// // async function createVideo(imagePaths, audioPath, outputName, duration) {
// //   const videoPath = path.join(TEMP_DIR, `${outputName}.mp4`);

// //   const secondsPerImage = Math.ceil(duration / imagePaths.length);

// //   return new Promise((resolve, reject) => {
// //     const command = ffmpeg();

// //     imagePaths.forEach((imgPath) => {
// //       if (!fs.existsSync(imgPath)) {
// //         console.error("❌ Missing image:", imgPath);
// //       } else {
// //         console.log("✅ Using image:", imgPath);
// //         command.input(imgPath).loop(secondsPerImage);
// //       }
// //     });

// //     if (!fs.existsSync(audioPath)) {
// //       return reject(new Error("❌ Audio file not found: " + audioPath));
// //     } else {
// //       console.log("✅ Using audio:", audioPath);
// //     }

// //     command
// //       .input(audioPath)
// //       .on("end", () => {
// //         if (!fs.existsSync(videoPath)) {
// //           return reject(new Error("❌ Video was not created"));
// //         }
// //         console.log(`🎬 Video created: ${videoPath}`);
// //         resolve(videoPath);
// //       })
// //       .on("error", (err) => {
// //         console.error("❌ ffmpeg error:", err.message);
// //         reject(err);
// //       })
// //       .outputOptions([
// //         "-pix_fmt yuv420p",
// //         "-c:v libx264",
// //         "-c:a aac",
// //         "-shortest",
// //       ])
// //       .save(videoPath);
// //   });
// // }

// // // 6. Main Pipeline
// // async function runPipeline({ prompt, genre, duration, publicOrPrivate, userId }) {
// //   try {
// //     const story = await generateStory(prompt, genre, duration);
// //     const keyScenes = extractKeyScenes(story);
// //     const storyName = story.split(".")[0].slice(0, 60);

// //     const imagePaths = [];
// //     for (let i = 0; i < keyScenes.length; i++) {
// //       const imgPath = await generateImage(keyScenes[i], i);
// //       imagePaths.push(imgPath);
// //     }

// //     const thumbnail = imagePaths[0];
// //     const audioPath = await generateTTS(story);

// //     const videoName = uuidv4();
// //     let videoPath;
// //     try {
// //       videoPath = await createVideo(imagePaths, audioPath, videoName, duration);
// //     } catch (err) {
// //       console.error("⚠️ Video creation failed:", err.message);
// //       videoPath = null;
// //     }

// //     return {
// //       story,
// //       storyName,
// //       thumbnail,
// //       videoPath,
// //       publicOrPrivate,
// //       userId,
// //     };
// //   } catch (err) {
// //     console.error("❌ Pipeline failed:", err.message);
// //     throw err;
// //   }
// // }

// // module.exports = { runPipeline };
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
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

//     const content = response.data?.choices?.[0]?.message?.content;
//     if (!content) throw new Error("Unexpected API response structure");

//     return content;
//   } catch (err) {
//     console.error("❌ Error from OpenRouter API:", err.response?.data || err.message);
//     throw new Error("Failed to generate story");
//   }
// }

// async function rephrasePromptWithOpenRouter(sentence) {
//   try {
//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-3.5-turbo", // or use gpt-4 if needed
//         messages: [
//           {
//             role: "system",
//             content: "You are an assistant that converts story sentences into short visual scene prompts for image generation.",
//           },
//           {
//             role: "user",
//             content: `Convert the following sentence into a short, vivid, visual scene description for an AI image generator:\n\n"${sentence}"`,
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

//     const simplified = response.data?.choices?.[0]?.message?.content?.trim();
//     return simplified || sentence;
//   } catch (err) {
//     console.error("⚠️ Prompt rephrasing failed:", err.response?.data || err.message);
//     return sentence; // Fallback to original
//   }
// }


// // 2. Extract key prompts from story
// async function extractKeyScenes(story, count = 4) {
//   const sentences = story.split(". ").filter(Boolean);
//   const interval = Math.floor(sentences.length / count);
//   const prompts = [];

//   for (let i = 0; i < count; i++) {
//     const index = i * interval;
//     if (sentences[index]) {
//       const original = sentences[index].trim();
//       const simplified = await rephrasePromptWithOpenRouter(original);
//       prompts.push(simplified);
//     }
//   }

//   return prompts;
// }


// // 3. Generate image using DALL·E 3
// async function generateImage(prompt, index) {
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/images/generations",
//       {
//         model: "dall-e-3",
//         prompt: prompt,
//         n: 1,
//         size: "1024x1024",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const imageUrl = response.data?.data?.[0]?.url;
//     if (!imageUrl) throw new Error("Image URL not found in DALL·E response");

//     const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

//     const filePath = path.join(TEMP_DIR, `image_${index}.png`);
//     fs.writeFileSync(filePath, imageResponse.data);
//     console.log(`✅ DALL·E image saved: ${filePath}`);
//     return filePath;
//   } catch (err) {
//     console.error(`❌ DALL·E image generation failed for "${prompt}":`, err.response?.data || err.message);
//     await new Promise(resolve => setTimeout(resolve, 2000)); // wait before retry
//     throw new Error("Failed to generate image using DALL·E");

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
// async function createVideo(imagePaths, audioPath, outputName, duration) {
//   const videoPath = path.join(TEMP_DIR, `${outputName}.mp4`);

//   const secondsPerImage = Math.ceil(duration / imagePaths.length);

//   return new Promise((resolve, reject) => {
//     const command = ffmpeg();

//     imagePaths.forEach((imgPath) => {
//       if (!fs.existsSync(imgPath)) {
//         console.error("❌ Missing image:", imgPath);
//       } else {
//         console.log("✅ Using image:", imgPath);
//         command.input(imgPath).loop(secondsPerImage);
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
// async function runPipeline({ prompt, genre, duration }) {
//   try {
//     const story = await generateStory(prompt, genre, duration);
//     const keyScenes = await extractKeyScenes(story);
//     const storyName = story.split(".")[0].slice(0, 60);

//     const imagePaths = [];
//     for (let i = 0; i < keyScenes.length; i++) {
//       const imgPath = await generateImage(keyScenes[i], i);
//       imagePaths.push(imgPath);
//       await new Promise(resolve => setTimeout(resolve, 2000)); // wait before retry

//     }

//     const thumbnail = imagePaths[0];
//     const audioPath = await generateTTS(story);

//     const videoName = uuidv4();
//     let videoPath;
//     try {
//       videoPath = await createVideo(imagePaths, audioPath, videoName, duration);
//     } catch (err) {
//       console.error("⚠️ Video creation failed:", err.message);
//       videoPath = null;
//     }

//     return {
//       story,
//       storyName,
//       thumbnail,
//       videoPath,
//     };
//   } catch (err) {
//     console.error("❌ Pipeline failed:", err.message);
//     throw err;
//   }
// }

// module.exports = { runPipeline };

function extractPublicIdFromUrl(url) {
  try {
    const parts = url.split("/upload/")[1]; // e.g. 'v1748103263/story_videos/hat_trick_xyz456.mp4'
    const publicIdWithExtension = parts.split("/").slice(1).join("/"); // removes version
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // removes .mp4 or .jpg
    return publicId;
  } catch (err) {
    console.error("Failed to extract public_id from:", url);
    return null;
  }
}

const Story = require("../models/storyModel"); // adjust path
const mongoose = require("mongoose");

async function updateOldStoriesWithPublicIds() {
  await mongoose.connect("mongodb+srv://fareesasiddiqui2003pk:LeQqAQeAvVudyY8b@verseai.8yt3mau.mongodb.net/verseAI?retryWrites=true&w=majority&appName=VerseAI");

  const stories = await Story.find({ publicVideoId: { $exists: false } });

  for (const story of stories) {
    const videoId = extractPublicIdFromUrl(story.videoUrl);
    const thumbnailId = extractPublicIdFromUrl(story.thumbnail);

    if (videoId && thumbnailId) {
      story.publicVideoId = videoId;
      story.publicThumbnailId = thumbnailId;
      await story.save();
      console.log(`✅ Updated story ${story._id}`);
    } else {
      console.warn(`⚠️ Could not extract public_id for ${story._id}`);
    }
  }

  console.log("🎉 Done updating stories.");
  mongoose.disconnect();
}

updateOldStoriesWithPublicIds()

