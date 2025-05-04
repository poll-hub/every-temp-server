const { User } = require("../../models/User/User");
const { verifyGoogleToken } = require("../../utils/verifyGoogleToken");
const jwt = require("jsonwebtoken");

const post = {
  login: async (req, res) => {
    const { idToken } = req.body;

    console.log(idToken);

    try {
      const { googleId, email, name, picture } = await verifyGoogleToken(
        idToken
      );

      let user = await User.findOne({ googleId });

      if (!user) {
        user = await User.create({ googleId, email, name, picture });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "14d",
      });

      return res.status(200).json({
        success: true,
        token,
      });
    } catch (error) {
      console.log(error.message);
      res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }
  },
};

module.exports = {
  post,
};
