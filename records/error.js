/* eslint-disable max-classes-per-file */
class ValidationError extends Error {}
class NotFoundError extends Error {}
class DatabaseConnectionError extends Error {}

function handleError(err, req, res) {
  if (err instanceof NotFoundError) {
    res.status(404).render('errors/error', {
      message: 'Element does not exist',
    });
  }
  if (err instanceof DatabaseConnectionError) {
    res.status(500).render('errors/error', {
      message: 'Database connection error',
    });
  }
  res
    .status(err instanceof ValidationError ? 400 : 500)
    .render('errors/error', {
      message: err instanceof ValidationError ? err.message : 'Try again later',
    });
}

module.exports = {
  handleError,
  ValidationError,
  NotFoundError,
  DatabaseConnectionError,
};
