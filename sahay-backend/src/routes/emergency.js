import express from 'express';
import { EmergencyContact, SOSLog } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/emergency/contacts
router.get('/contacts', protect, async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/emergency/contacts
router.post('/contacts', protect, async (req, res) => {
  try {
    const { contactName, phoneNumber, relationship } = req.body;
    const contact = await EmergencyContact.create({
      userId: req.user._id,
      contactName,
      phoneNumber,
      relationship,
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/emergency/contacts/:id
router.delete('/contacts/:id', protect, async (req, res) => {
  try {
    const contact = await EmergencyContact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/emergency/sos — log an SOS alert
router.post('/sos', protect, async (req, res) => {
  try {
    const { location } = req.body;
    const log = await SOSLog.create({
      userId: req.user._id,
      location: location || 'Location unavailable',
    });
    res.status(201).json({ message: 'SOS logged', log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
