const router = require("express").Router();
const { User }  = require("../../modals/User");

//const userLogin = (req, res) => {
  router.post('/login', (req,res) => {
  const data = req.body;

  const errors = {};

  if (!data.email || !data.password || data.email === "" ) {
    errors["inputError"] = "Fields not provided";
  }
  User.findOne({ email: req.body.email }, (err, user) => {

    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
          userToken: user.token,
        });
      });
    });
  });
//};
})

//module.exports = userLogin;
module.exports = router