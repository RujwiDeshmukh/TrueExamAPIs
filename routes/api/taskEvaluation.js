const express = require('express');
const router = express.Router();
const { Task } = require('../../modals/Task')
const { auth } = require('../../middleware/auth')


router.post('/instructor/evaluate/:tid', auth, (req, res) => {
    const { score } = req.body;
    taskId = req.params.tid;
    Task.findOne({ _id: taskId })
        .then( task => {
            if(!task) {
                return res.status(400).send('Task not found!');
            }
            if(task.insID !== String(req.user._id)) {
                return res.status(400).send('Task not belong to this user')
            }
            task.score = score;
            task.save();
            return res.status(200).send({success : true, score :  score})
        });
});

module.exports = router;