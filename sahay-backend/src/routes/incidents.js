import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Incident, Evidence } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/incidents
router.get('/', protect, async (req, res) => {
  try {
    const incidents = await Incident.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/incidents/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findOne({ _id: req.params.id, userId: req.user._id });
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    const evidence = await Evidence.find({ incidentId: incident._id });
    res.json({ ...incident.toObject(), evidence });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/incidents
router.post('/', protect, async (req, res) => {
  try {
    const { incidentDate, incidentTime, location, description, involvedParties } = req.body;
    const lastIncident = await Incident.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    const previousHash = lastIncident ? lastIncident.hash : '0';
    const dataToHash = `${incidentDate}${incidentTime}${location}${description}${previousHash}`;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    const incident = await Incident.create({
      userId: req.user._id, incidentDate, incidentTime, location,
      description, involvedParties: involvedParties || '', hash, previousHash,
    });
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/incidents/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    await Evidence.deleteMany({ incidentId: req.params.id });
    res.json({ message: 'Incident deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/incidents/:id/evidence
router.post('/:id/evidence', protect, upload.single('file'), async (req, res) => {
  try {
    const incident = await Incident.findOne({ _id: req.params.id, userId: req.user._id });
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileHash = crypto.createHash('sha256').update(req.file.originalname + Date.now()).digest('hex');
    const evidence = await Evidence.create({
      incidentId: incident._id, fileName: req.file.originalname,
      fileType: req.file.mimetype, fileHash, filePath: req.file.path,
    });
    res.status(201).json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
