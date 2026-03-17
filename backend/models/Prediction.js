const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    riskScore: { type: Number, required: true },
    predictedIssue: { type: String, required: true },
    recommendation: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
