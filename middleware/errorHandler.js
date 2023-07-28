const errorHandler = (err, req, res, next) => {
    console.log(err);
    const error = {};
    error.statusCode = err?.statusCode || 500;
    error.message = err?.message || "Something went wrong.";
    res?.status(error.statusCode).json({ error: error });
};

module.exports = errorHandler;