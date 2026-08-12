function notFound(req, _res, next) {
  const error = new Error(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'ROUTE_NOT_FOUND';
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || error.status || 500;
  const code = error.code || (statusCode === 400 ? 'INVALID_JSON' : 'INTERNAL_ERROR');
  const message = statusCode === 500 ? 'Erro interno do servidor.' : error.message;
  if (statusCode === 500) console.error(error);
  res.status(statusCode).json({ error: { code, message } });
}

module.exports = { notFound, errorHandler };
