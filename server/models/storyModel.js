// import mongoose, { mongo } from 'mongoose';
const mongoose = require('mongoose')
const Schema = mongoose.Schema()

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storyName: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  publicVideoId: {
    type: String,
    default: null, // ✅ allows existing docs to be valid
  },
  publicThumbnailId: {
    type: String,
    default: null,
  },

  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  }
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema)
module.exports = Story
// export default mongoose.model('Story', storySchema);
