require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { v4: uuidv4 } = require("uuid");
const { uploadToCloudinary } = require('../utils/cloudinary')
const gTTS = require("gtts");

const TEMP_DIR = path.join(__dirname, "../temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// Environment Variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Step 1: Story Generation
async function generateStory(prompt, genre, duration) {
  const wordsPerSecond = 2.3; // average speech rate (2.0–2.5)
  const targetWordCount = Math.floor(duration * wordsPerSecond);

  const message = `Write a complete ${genre} story in ${targetWordCount} words or less for a ${duration}-second video.
The story should be vivid, interesting, and feel complete with a beginning, middle, and end. 
Here is the prompt: "${prompt}"`;

  const storyRes = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [{ role: "user", content: message }],
    },
    {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
    }
  );

  const story = storyRes.data.choices[0].message.content;
  console.log('the story generate is: ',story);
  
  const titlePrompt = `Based on the following prompt and story, suggest a creative, catchy title (under 10 words) that fits the story's theme and mood. 
Only return the title without quotes or punctuation at the end.

Prompt: "${prompt}"
Story: "${story}"`;

  const titleRes = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
    model: "deepseek/deepseek-chat-v3-0324:free",  // ✅ Use valid free model
      messages: [{ role: "user", content: titlePrompt }],
    },
    {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
    }
    
  );

  const title = titleRes.data.choices[0].message.content.trim();

  return { story, title };
}


// Step 2: Extract Key Scenes
function getSceneCount(duration) {
  if (duration <= 30) return 2;
  if (duration <= 60) return 2;
  if (duration <= 120) return 3;
  if (duration <= 180) return 3;
  if (duration <= 240) return 4;
  return 5;
}

async function extractScenes(story, sceneCount) {
  const prompt = `From the following story, extract ${sceneCount} short and descriptive key visual scenes that help visualize the story. 
Keep them concise and vivid. Only output each scene in a new line:\n\n${story}`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
    }
  );

  const raw = response.data.choices[0].message.content;
  return raw.split("\n").filter(line => line.trim().length > 10).slice(0, sceneCount);  // Limit to requested count;
}

// Extract Style
async function extractStyles(prompt, story) {
  const stylePrompt = `Based on the following prompt and story, describe:
1. The main character's visual appearance (e.g., "A brave knight in silver armor with a red cape")
2. The visual art style (e.g., "in a Studio Ghibli style" or "in a soft watercolor illustration style").

Return the result in the following JSON format:
{
  "characterStyle": "...",
  "visualStyle": "..."
}

Prompt: "${prompt}"
Story: "${story}"`;

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [{ role: "user", content: stylePrompt }],
    },
    {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
    }
  );

  const content = res.data.choices[0].message.content;

  // Strip code block formatting if present (e.g., ```json ... ```)
const cleaned = content.replace(/```json|```/g, "").trim(); 

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse style JSON:", content);
    return {
      characterStyle: "A character",
      visualStyle: "in a digital art style"
    };
  }
}


// Step 3: Generate Image using DALL·E
async function generateImage(scene, index) {
  try {
    if (!scene || scene.length < 10 || scene.length > 1000) {
      throw new Error("Invalid prompt for DALL·E generation");
    }

    console.log("Generating image for prompt:", scene);


    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt: scene,
        n: 1,
        size: "1024x1024",
        style: "vivid",
        quality: "standard"

      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    //   const imagePath = path.join(TEMP_DIR, `image_${index}.png`);
    const timestamp = Date.now();
    const safePrompt = scene.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const imagePath = path.join(TEMP_DIR, `image_${index}_${safePrompt}_${timestamp}.png`);


    const writer = fs.createWriteStream(imagePath);
    const imageStream = await axios.get(imageUrl, { responseType: "stream" });
    imageStream.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    return imagePath;
  } catch (err) {
    console.error("Image generation failed:", err.response?.data || err.message);
    await new Promise((r) => setTimeout(r, 5000)); // wait for rate limiting

  }
}

// Step 4: Text-to-Speech using gTTS
async function generateAudio(storyText) {
  const audioPath = path.join(TEMP_DIR, `${uuidv4()}.mp3`);
  return new Promise((resolve, reject) => {
    const tts = new gTTS(storyText);
    tts.save(audioPath, (err) => (err ? reject(err) : resolve(audioPath)));
  });
}

// Step 5: Stitch Images + Audio into Video
async function createVideo(images, audioPath, duration) {
  const outputPath = path.join(TEMP_DIR, `${uuidv4()}.mp4`);
  const inputListPath = path.join(TEMP_DIR, `${uuidv4()}_input.txt`);

  // Validate image paths
  const validImages = images.filter(img => img && fs.existsSync(img));
  if (!validImages.length) {
    throw new Error("No valid image paths available for video generation.");
  }
  const secPerImage = duration / images.length;


  // Generate a list file for ffmpeg concat
  const inputListContent = validImages
    .map((img) => `file '${img.replace(/\\/g, "/")}'\nduration ${secPerImage}`)
    .join("\n");

  // Add the last image again to avoid freeze at the end (ffmpeg quirk)
  const lastImage = images[images.length - 1];
  const finalInputList = `${inputListContent}\nfile '${lastImage}'`;

  fs.writeFileSync(inputListPath, finalInputList);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputListPath)
      .inputOptions(["-f concat", "-safe 0"])
      .input(audioPath)
      .outputOptions([
        "-c:v libx264",
        "-pix_fmt yuv420p",
        "-c:a aac",
        // `-t ${duration}`, // Trim both audio and video to duration
        "-shortest",
      ])
      .save(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", reject);
  });
}

function sanitizeForDalle(prompt) {
  const sensitiveWordsMap = {
    murder: "dark fate",
    killing: "mysterious end",
    kill: "defeat",
    blood: "ominous glow",
    fight: "tense clash",
    fighting: "confrontation",
    deadly: "ominous",
    death: "darkness",
    vampire: "shadowy figure",
    werewolf: "beastly creature",
    haunted: "eerie",
    horror: "dark fantasy",
    violence: "intensity",
    showdown: "dramatic encounter",
    attack: "ambush",
    evil: "ominous presence",
    hunt: "pursuit",
    hunted: "pursued",
    terror: "dread",
    scary: "intense",
    scary: "mysterious"
  };

  const regex = new RegExp(`\\b(${Object.keys(sensitiveWordsMap).join('|')})\\b`, 'gi');
  return prompt.replace(regex, (match) => sensitiveWordsMap[match.toLowerCase()] || match);
}


// Final Combined Pipeline
async function runVideoPipeline({ prompt, genre, duration }) {
  try {
    console.log("📝 Generating Story...");
    const { story, title: storyTitle } = await generateStory(prompt, genre, duration);

    console.log("📚 Extracting Key Scenes...");
    const sceneCount = getSceneCount(duration);
    const scenes = await extractScenes(story, sceneCount);

    const { characterStyle, visualStyle } = await extractStyles(prompt, story);

    console.log("🖼️ Generating Images...");
    const imagePaths = [];
    for (let i = 0; i < scenes.length; i++) {
      const rawPrompt = `${characterStyle}, ${scenes[i]}, ${visualStyle}`;
      const fullPrompt = sanitizeForDalle(rawPrompt);
      const imgPath = await generateImage(fullPrompt, i);
      imagePaths.push(imgPath);
      await new Promise((r) => setTimeout(r, 2000)); // wait for rate limiting
    }


    console.log("🔊 Generating Audio...");
    const audioPath = await generateAudio(story);

    console.log("🎬 Creating Final Video...");
    const videoPath = await createVideo(imagePaths, audioPath, duration);

    console.log("☁️ Uploading to Cloudinary...");
    const videoUpload = await uploadToCloudinary(videoPath, "story_videos", "video");
    const thumbnailUpload = await uploadToCloudinary(imagePaths[0], "story_thumbnails", "image");

    const videoUrl = videoUpload.url;
    const publicVideoId = videoUpload.public_id;

    const thumbnailUrl = thumbnailUpload.url;
    const publicThumbnailId = thumbnailUpload.public_id;
    // Cleanup
    [...imagePaths, audioPath, videoPath].forEach((f) => fs.unlinkSync(f));

    return {
      storyTitle,
      story,
      videoUrl,
      thumbnailUrl,
      publicVideoId,
      publicThumbnailId,
      duration,
    };
  } catch (err) {
    console.error("❌ Pipeline failed:", err);
    throw err;
  }
}

module.exports = { runVideoPipeline };
