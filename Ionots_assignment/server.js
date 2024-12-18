// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://karthikkolamuri:Ka45h8k@cluster0.lhwgk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Project Assignment Schema
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    candidates: [{ name: String, accepted: Boolean, progress: Number, score: Number }],
});

const Project = mongoose.model('Project', projectSchema);

// Routes
app.get('/projects', async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

app.post('/projects', async (req, res) => {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
});

app.put('/projects/:id/progress', async (req, res) => {
    const { id } = req.params;
    const { candidateName, progress, score } = req.body;

    const project = await Project.findById(id);
    const candidate = project.candidates.find(c => c.name === candidateName);
    
    if (candidate) {
        candidate.progress = progress;
        candidate.score = score;
        await project.save();
        res.json(project);
    } else {
        res.status(404).send('Candidate not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
