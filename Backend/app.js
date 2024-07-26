const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const User = require('./model/user.js'); // Ensure the model is correct

mongoose.connect("mongodb://localhost:27017/Jobapplication");

const database = mongoose.connection;

database.once("connected", () => {
    console.log("Database Connected");
});

database.on("error", (error) => {
    console.log(error);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Application.html'));
});

app.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const result = await User.create(data);
        console.log(result);
        res.status(201).redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});


// Get all job applications
app.get('/job', async (req, res) => {
    try {
        const jobs = await User.find(); // Changed from Job to User
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a job application by ID
app.get('/job/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const details = await User.findOne({ _id: id }); // Use _id for MongoDB ObjectID
        if (details) {
            res.json(details);
        } else {
            res.status(404).json({ message: 'Job application not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Update a job application by ID
app.put('/job/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const updatedDetails = await User.findOneAndUpdate({ _id: id }, updatedData, options);

        if (updatedDetails) {
            res.status(200).json(updatedDetails);
        } else {
            res.status(404).json({ message: 'Job application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a job application by ID
app.delete('/job/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedDetails = await User.findOneAndDelete({ _id: id }); // Use _id for MongoDB ObjectID

        if (deletedDetails) {
            res.status(200).json({ message: 'Job application deleted successfully' });
        } else {
            res.status(404).json({ message: 'Job application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

