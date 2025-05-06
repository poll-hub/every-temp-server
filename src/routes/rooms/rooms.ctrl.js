const { User } = require("../../models/User/User");
const { Room } = require("../../models/Room/Room");
const { OAuth2Client } = require("google-auth-library");

const get = {
  list: async (req, res) => {
    try {
      const rooms = await Room.find({}).lean();

      return res.status(200).json({
        success: true,
        rooms,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

const post = {
  create: async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const { idToken } = req.cookies;
    const { name, description } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const googleId = payload.sub;

      const user = await User.findOne({ googleId });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const room = new Room({
        name,
        description,
        createdBy: user._id,
      });

      await room.save();

      return res.status(201).json({
        success: true,
        room: room,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = {
  get,
  post,
};
