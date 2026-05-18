export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('joinAdmin', () => {
      socket.join('admin');
      console.log(`[Socket] ${socket.id} joined admin room`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};

export const attachIo = (io) => (req, res, next) => {
  req.io = io;
  next();
};
