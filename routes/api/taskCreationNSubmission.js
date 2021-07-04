const express = require('express');
const router = express.Router();
const fs = require('fs');
const {auth} = require('../../middleware/auth')
const { User } = require('../../modals/User')
const { Task } = require('../../modals/Task')


const multer = require('multer');
const path = require('path');

const storageOriginal = multer.diskStorage({
   /* destination: './uploads/originals',
    filename: function(req, file, callback) {
        callback(null, randomstring.generate() + path.extname(file.originalname))
    }	*/
    destination: (req, file, cb) => {
        cb(null, 'uploads/originals')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }	     
});



const storageEdit = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/edits')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }	     
});

/*const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
        callback(null, true);
    else
        callback(null,false);
}*/

const uploadOriginal = multer({storage: storageOriginal}).single('image');
const uploadEdit = multer({storage: storageEdit}).single('image');


router.post('/instructor/createTask' ,auth, uploadOriginal ,(req, res) => {
    const { email } = req.body;

    User.findOne({ email: email})
        .then(user =>{
            if(user)
            {
                if(user.userType === 'S')
                {
                    const newTask = new Task({
                        insID: req.user._id,
                        studentEmail: req.user.email,
                        originalImage: req.file.path,
                        editImage: null,
                        score: -1
                    });
                    newTask.save()
                    .then(task => {
                            return res.status(200).json({ success : true, msg :'Task Created Successfully', task : task })
            
                    })
                    .catch(error => console.log(error));
                } else {
                    fs.unlink(req.file.path, (err) => {
                        if(err) 
                        {
                           return res.status(400).send(err);
                        }
                    });
                    return res.status(400).send({ msg : 'No student found with this id'});
                    
                }
            } else {
                fs.unlink(req.file.path, (err) => {
                    if(err) 
                        {
                           return res.status(400).send(err);
                        }
                });
                return res.status(400).json("Error!");
            }
        });
});


router.post('/student/submitTask/:tid', auth ,uploadEdit, (req, res) => {
    taskId = req.params.tid;
    Task.findOne({ _id: taskId })
        .then( task => {
            if(!task) {
                fs.unlink(req.file.path, (err) => {
                    if(err)
                    {
                        return res.status(400).json(err);
                    }
                });
                return res.status(400).json({ success : false, msg :'Task Not Found!' })
            }
            if(task.studentEmail !== req.user.email) {
                fs.unlink(req.file.path, (err) => {
                    if(err)
                    {
                        return res.status(400).json(err);
                    }
                });

                return res.status(400).json({ success : false, msg : 'This Task dont belong to you !' })
            }
            task.editImage = req.file.path;
            task.save();
            return res.status(400).json({ success : true, msg :'Task Submitted!', task : task })
        })
        .catch(error => {
             console.log(error)
        })
    
    
});



module.exports = router