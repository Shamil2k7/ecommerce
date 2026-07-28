import ApiError from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    error = new ApiError(
      statusCode,
      message,
      error.errors || [],
      err.stack
    );
  }

  if (err.name === "MulterError") {
    error = new ApiError(400, err.message);
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
  });
};

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found - ${req.originalUrl}`));
};