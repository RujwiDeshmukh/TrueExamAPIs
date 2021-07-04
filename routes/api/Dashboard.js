const express = require('express');
const router = express.Router();
const { Task } = require('../../modals/Task')

router.post('/student', async (req, res) => {

    const tasks  = await Task.find({ studentEmail: req.body.email });

     if(!tasks )
     {
        return res.status(400).send('There is no tasks created for students !');
     }

     return res.status(200).json({success : true, tasks : tasks})
    
});


router.post('/instructor',  async (req, res) => {
    const tasks = await Task.find({ insID: req.body._id });

    console.log(tasks);

    if(!tasks)
    {
       return res.status(400).send('There is no tasks created by instructors !');
    }

    return res.status(200).json({success : true, tasks : tasks})
    
});

module.exports = router