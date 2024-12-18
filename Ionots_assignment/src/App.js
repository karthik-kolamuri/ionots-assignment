// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ title: '', description: '' });
    const [candidateName, setCandidateName] = useState('');
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await axios.get('http://localhost:5000/projects');
            setProjects(response.data);
        };
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:5000/projects', newProject);
        setProjects([...projects, response.data]);
        setNewProject({ title: '', description: '' });
    };

    const handleProgressUpdate = async (projectId) => {
        await axios.put(`http://localhost:5000/projects/${projectId}/progress`, {
            candidateName,
            progress,
            score,
        });
        setCandidateName('');
        setProgress(0);
        setScore(0);
        const response = await axios.get('http://localhost:5000/projects');
        setProjects(response.data);
    };

    return (
        <div>
            <h1>Project Assignments</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    required
                />
                <button type="submit">Add Project</button>
            </form>

            <ul>
                {projects.map((project) => (
                    <li key={project._id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <h3>Candidates:</h3>
                        <ul>
                            {project.candidates.map((candidate, index) => (
                                <li key={index}>
                                    {candidate.name} - Progress: {candidate.progress}, Score: {candidate.score}
                                    <button onClick={() => handleProgressUpdate(project._id)}>Update Progress</button>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <h2>Update Candidate Progress</h2>
            <input
                type="text"
                placeholder="Candidate Name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Progress"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
            />
            <input
                type="number"
                placeholder="Score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
            />
        </div>
    );
}

export default App;
