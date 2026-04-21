import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ── User ──────────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  phone:     { type: String, default: '' },
  password:  { type: String, required: true },
  role:      { type: String, default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export const User = mongoose.model('User', userSchema);

// ── Incident ──────────────────────────────────────────────────────────────────
const incidentSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  incidentDate:    { type: String, required: true },
  incidentTime:    { type: String, required: true },
  location:        { type: String, required: true },
  description:     { type: String, required: true },
  involvedParties: { type: String, default: '' },
  hash:            { type: String, required: true },
  previousHash:    { type: String, required: true },
}, { timestamps: true });

export const Incident = mongoose.model('Incident', incidentSchema);

// ── Evidence ──────────────────────────────────────────────────────────────────
const evidenceSchema = new mongoose.Schema({
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  fileName:   { type: String, required: true },
  fileType:   { type: String, required: true },
  fileHash:   { type: String, required: true },
  filePath:   { type: String, required: true }, // path on server
}, { timestamps: true });

export const Evidence = mongoose.model('Evidence', evidenceSchema);

// ── Complaint ─────────────────────────────────────────────────────────────────
const complaintSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  incidentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  authorityType: { type: String, required: true },
  status:        { type: String, default: 'pending', enum: ['pending', 'submitted', 'in-review', 'resolved', 'closed'] },
  notes:         { type: String, default: '' },
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);

// ── Emergency Contact ─────────────────────────────────────────────────────────
const emergencyContactSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactName:  { type: String, required: true },
  phoneNumber:  { type: String, required: true },
  relationship: { type: String, required: true },
}, { timestamps: true });

export const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

// ── SOS Log ───────────────────────────────────────────────────────────────────
const sosLogSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location:  { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export const SOSLog = mongoose.model('SOSLog', sosLogSchema);
