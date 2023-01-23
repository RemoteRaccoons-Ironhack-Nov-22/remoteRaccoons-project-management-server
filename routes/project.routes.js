const router = require("express").Router();
const mongoose = require('mongoose');

const Project = require('../models/Project.model');
const Task = require('../models/Task.model');


//  POST /api/projects  -  Creates a new project
router.post('/projects', (req, res, next) => {
    const { title, description } = req.body;

    Project.create({ title, description, tasks: [] })
        .then(response => res.json(response))
        .catch(err => {
            console.log("error creating new project", err);
            res.status(500).json(err)
        });
});



// GET /api/projects -  Retrieves all of the projects
router.get('/projects', (req, res, next) => {
    Project.find()
        .populate('tasks')
        .then(allProjects => res.json(allProjects))
        .catch(err => {
            console.log("error getting projects from DB", err);
            res.status(500).json(err)
        });
});



//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    // Each Project document has a `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Project.findById(projectId)
        .populate('tasks')
        .then(project => res.json(project))
        .catch(err => {
            console.log("error getting project details from DB", err);
            res.status(500).json(err);
        });
});


// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Project.findByIdAndUpdate(projectId, req.body, { new: true })
        .then((updatedProject) => res.json(updatedProject))
        .catch(err => {
            console.log("error updating project", err);
            res.status(500).json(err)
        });
});


// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Project.findByIdAndRemove(projectId)
        .then(() => res.json({ message: `Project with ${projectId} is removed successfully.` }))
        .catch(err => {
            console.log("error deleting project", err);
            res.status(500).json(err)
        });
});




module.exports = router;
