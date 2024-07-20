import { Schema, model } from 'mongoose';

const videoSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  fileId: { type: Schema.Types.ObjectId, required: true },
});

const Video = model('Video', videoSchema);

export { Video };
