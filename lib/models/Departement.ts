import mongoose from 'mongoose';

const DepartementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Departement || mongoose.model('Departement', DepartementSchema);