const express = require('express');
const tododb = require('../services/tododb');

const router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        res.status(200).json(await tododb.getAllTasks());
    } catch (err) {
        next(err);
    }
});

router.post('/new', async function (req, res, next) {
    try {
        res.status(200).json(await tododb.addTask(req.body));
    } catch (err) {
        next(err);
    }
});

router.delete('/delete/:id', async function (req, res, next) {
    try {
        res.status(200).json(await tododb.removeTask(req.params.id));
    } catch (err) {
        next(err);
    }
});

router.put('/edit', async function (req, res, next) {
    try {
        res.status(200).json(await tododb.updateTasks(req.body));
    } catch (err) {
        next(err);
    }
});

module.exports = router;