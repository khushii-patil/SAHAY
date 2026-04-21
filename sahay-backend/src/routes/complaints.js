import express from 'express';
import { Complaint } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/complaints
router.get('/', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate('incidentId', 'incidentDate location description incidentTime')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/complaints/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('incidentId');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/complaints
router.post('/', protect, async (req, res) => {
  try {
    const { incidentId, authorityType, notes } = req.body;
    const complaint = await Complaint.create({
      userId: req.user._id, incidentId, authorityType, notes: notes || '',
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/complaints/:id/status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: req.body.status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/complaints/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
