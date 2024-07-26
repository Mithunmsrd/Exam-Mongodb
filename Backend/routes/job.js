const express = require('express');
const Job = require('../model/user');
const { authenticateToken, authorizeRole } = require('../middleware/authmiddleware');
const router = express.Router();

// Apply for a Job
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'user') return res.sendStatus(403);

    try {
        const count = await Job.countDocuments();
        const applicationID = count + 1;

        const job = new Job({
            ApplicationID: applicationID,
            ...req.body,
            ApplicationDate: new Date(req.body.ApplicationDate)
        });

        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Job Applications
router.get('/', authenticateToken, async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Job Applications by Position
router.get('/position/:jobPosition', authenticateToken, async (req, res) => {
    try {
        const { jobPosition } = req.params;
        const jobs = await Job.find({ JobPosition: jobPosition });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Job Status
router.put('/:id', authenticateToken, authorizeRole(['hr']), async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { Status: req.body.Status }, { new: true });
        if (!job) return res.status(404).json({ message: 'Job application not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Job Application
router.delete('/:id', authenticateToken, authorizeRole(['hr']), async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job application not found' });
        res.status(200).json({ message: 'Job application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
