import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Helpline schema
const helplineSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  number:   { type: String, required: true },
  category: { type: String, default: 'general' }, // general, women, police, legal, cyber
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Helpline = mongoose.model('Helpline', helplineSchema);

// Seed default helplines if none exist
async function seedHelplines() {
  const count = await Helpline.countDocuments();
  if (count === 0) {
    await Helpline.insertMany([
      { name: 'Emergency',           number: '112', category: 'general' },
      { name: 'Women Helpline',      number: '181', category: 'women'   },
      { name: 'Police',              number: '100', category: 'police'  },
      { name: 'Ambulance',           number: '108', category: 'general' },
      { name: 'Child Helpline',      number: '1098', category: 'general' },
      { name: 'Cyber Crime',         number: '1930', category: 'cyber'  },
      { name: 'Legal Aid',           number: '15100', category: 'legal' },
      { name: 'NCW Helpline',        number: '7827170170', category: 'women' },
      { name: 'Anti Stalking',       number: '100', category: 'women'  },
      { name: 'Domestic Violence',   number: '181', category: 'women'  },
    ]);
    console.log('Default helplines seeded');
  }
}

seedHelplines();

// GET /api/helplines — get all active helplines
router.get('/', async (req, res) => {
  try {
    const helplines = await Helpline.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(helplines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/helplines — add a new helpline (admin use)
router.post('/', async (req, res) => {
  try {
    const { name, number, category } = req.body;
    if (!name || !number) return res.status(400).json({ message: 'Name and number are required' });
    const helpline = await Helpline.create({ name, number, category });
    res.status(201).json(helpline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/helplines/:id
router.delete('/:id', async (req, res) => {
  try {
    await Helpline.findByIdAndDelete(req.params.id);
    res.json({ message: 'Helpline deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
