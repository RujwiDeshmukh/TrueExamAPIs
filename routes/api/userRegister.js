const router = require("express").Router();
const { User }  = require("../../modals/User");

//const userRegister = async (req, res) => {
  router.post('/register' , async ( req,res) => {
  const data = req.body;
  const errors = {};
  if (
    !data.name ||
    !data.email ||
    !data.password ||
    !data.userType ||
    data.userType === "" ||
    data.name === "" ||
    data.email === ""
  ) {
    errors["inputError"] = "Fields not provided";
  }
  try {
    if (!data.name || !data.email || !data.password || !data.userType) {
      return res.status(400).json({errors});
    }
    let newuser = new User(data);
    newuser = await newuser.save();

    return res.status(200).json({ user_id: newuser.id ,msg: 'Registration succesfull, you can log in now'});
  } catch (error) {
    console.log(error);
  }
  return res.sendStatus(500).json({errors});
//};
})

//module.exports = userRegister;
module.exports = router;

