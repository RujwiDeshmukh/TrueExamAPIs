const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const db = require('./config/keys').MongoURI;

//Connect to mongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err => console.log(err)));

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.status(200).send("Incorrect Path");
  });

//Routes
//app.use('/', require('./routes/api/index'));
//app.use('/user', require('./routes/api/index'));
app.use('/user',require('./routes/api/userRegister'))
app.use('/user',require('./routes/api/userLogin'))
app.use('/task',require('./routes/api/taskCreationNSubmission'))
app.use('/dashboard', require('./routes/api/Dashboard'))
app.use('/tasks', require('./routes/api/taskEvaluation'))


const PORT =  process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
}); 