const { Vote } = require("../models/Vote/Vote");

const handleJoinRoom = (socket, roomId) => {
  socket.join(roomId);
  console.log(`[SocketCtrl] ${socket.id} joined room ${roomId}`);
};

const handleLeaveRoom = (socket, roomId) => {
  socket.leave(roomId);
  console.log(`[SocketCtrl] ${socket.id} left room ${roomId}`);
};

const handleSubmitVote = async (
  io,
  socket,
  { roomId, userId, temperature }
) => {
  try {
    await Vote.findOneAndUpdate(
      { room: roomId, user: userId },
      { temperature },
      { upsert: true, new: true }
    );

    const countMap = await countVotesByRoom(roomId);

    // 모든 클라이언트에게 투표 현황 전송
    io.to(roomId).emit("voteUpdate", {
      votes: countMap,
      mostVotedTemp: getMostVoted(countMap),
    });

    console.log(
      `[SocketCtrl] Vote submitted & broadcasted in room ${roomId}:`,
      countMap
    );
  } catch (err) {
    console.error(`[SocketCtrl] Vote error:`, err);
    socket.emit("voteError", { message: "투표 처리 중 오류 발생" });
  }
};

const handleVoteStatusRequest = async (socket, roomId) => {
  try {
    const countMap = await countVotesByRoom(roomId);

    // 요청한 클라이언트에게만 응답
    socket.emit("voteStatus", {
      votes: countMap,
      mostVotedTemp: getMostVoted(countMap),
    });

    console.log(
      `[SocketCtrl] Sent vote status to ${socket.id} for room ${roomId}`
    );
  } catch (err) {
    console.error(`[SocketCtrl] Vote status error:`, err);
    socket.emit("voteError", { message: "현황 조회 중 오류 발생" });
  }
};

const handleDisconnect = (socket, reason) => {
  console.log(`[SocketCtrl] ${socket.id} disconnected: ${reason}`);
};

async function countVotesByRoom(roomId) {
  const votes = await Vote.find({ room: roomId });
  const countMap = {};
  votes.forEach((v) => {
    countMap[v.temperature] = (countMap[v.temperature] || 0) + 1;
  });
  return countMap;
}

function getMostVoted(countMap) {
  const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || null;
}

module.exports = {
  handleJoinRoom,
  handleLeaveRoom,
  handleSubmitVote,
  handleVoteStatusRequest,
  handleDisconnect,
};
