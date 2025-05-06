const ctrl = require("./sockets.ctrl");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    socket.onAny((eventName, ...args) => {
      console.log(
        `[Socket DEBUG] Event received from ${socket.id}: Event Name = '${eventName}', Arguments =`,
        args
      );
    });

    socket.on("joinRoom", (roomId) => {
      ctrl.handleJoinRoom(socket, roomId);
    });

    socket.on("submitVote", (data) => {
      ctrl.handleSubmitVote(io, socket, data);
    });

    socket.on("getVoteStatus", (roomId) => {
      ctrl.handleVoteStatusRequest(socket, roomId);
    });

    socket.on("leaveRoom", (roomId) => {
      ctrl.handleLeaveRoom(socket, roomId);
    });

    socket.on("disconnect", (reason) => {
      ctrl.handleDisconnect(socket, reason);
    });

    socket.on("error", (error) => {
      console.error(`[Socket] Error for ${socket.id}:`, error);
    });
  });

  console.log("[Socket] Socket.IO event listeners set up.");
};
