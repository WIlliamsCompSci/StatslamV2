import mongoose from 'mongoose';

const athleteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    team: { type: String },
    position: { type: String },
    stats: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model('Athlete', athleteSchema);