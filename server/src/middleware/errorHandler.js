const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error('\n──────── API ERROR ────────');
  console.error(`Route:  ${req.method} ${req.originalUrl}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Name:   ${err.name}`);
  console.error(`Message: ${err.message}`);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }
  console.error('───err──────\n');

  res.status(statusCode).json({
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
