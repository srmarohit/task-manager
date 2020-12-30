const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/tasks', auth, async (req, res) => {
	const match = {};
	const sort = {};

	if (req.query.completed) {
		match.completed = req.query.completed === 'true'; // req.query.completed return value in a String format. 
	}

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(':');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 ;
	}

	try {
		await req.user.populate({
			path: 'tasks',
			match,
			options: {
				limit: parseInt(req.query.limit),
				skip: parseInt(req.query.skip),
				sort
			}
		}).execPopulate();

		if (!req.user.tasks)
			return res.status(404).send("No task is found..");

		res.status(200).send(req.user.tasks);
	}
	catch (e) {
		console.log("Error : Internal Server Error to get Tasks " + e);
		res.status(500).send("Error : Internal error to get Tasks "+e);
	}
});

router.post('/tasks', auth, async (req,res) => {
	const task = new Task({
		...req.body,
		owner : req.user._id
	});
	try {
		await task.save();
		if (!task)
			return res.status(404).send("Data is not saved..");

		res.status(201).send(task);
	}
	catch (e) {
		console.log("Error : Internal Server Error to post Tasks " + e);
		res.status(500).send("Error : Internal error to post Tasks " + e);
	}
});

router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findOne({ _id, owner : req.user._id });
		if (!task)
			return res.status(404).send("Error : data not found..");

		res.status(200).send(task);
	}
	catch (e) {
		console.log("Error : Internal Server Error to get Task by id " + e);
		res.status(500).send("Error : Internal error to get Task by id" + e);
	}
});

router.patch('/tasks/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdate = ['description', 'completed'];
	const isValidate = updates.every(update => allowedUpdate.includes(update));

	if (!isValidate)
		return res.status(403).send("Error : Parameter is not valid..and not allowed to update..");

	try {
		const task = await Task.findOne({_id : req.params.id, owner : req.user._id });
		if (!task)
			return res.status(404).send("Error : no task found to update..");

		updates.forEach(update => task[update] = req.body[update]);     // dynamically store data from req.body

		await task.save();

		res.status(203).send(task);
	}
	catch (e) {
		console.log("Error : Internal Server Error to update Task " + e);
		res.status(500).send("Error : Internal error to update Task " + e);
	}
});

router.delete('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.deleteOne({ _id , owner : req.user._id});
		if (!task)
			return res.status(401).send("Error : data not found to delete.");

		res.status(204).send(task);
	}
	catch (e) {
		console.log("Error : Internal Server Error to delete Tasks " + e);
		res.status(500).send("Error : Internal error to delete Tasks " + e);
	}
});

module.exports = router;




