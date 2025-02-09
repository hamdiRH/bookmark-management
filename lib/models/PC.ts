import mongoose from 'mongoose';

const PCSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departement',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PC || mongoose.model('PC', PCSchema);