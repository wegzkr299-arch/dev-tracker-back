const noBodyAllowed = (req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    return res.status(400).json({
      message: "Request body is not allowed for this endpoint!",
    });
  }
  next();
};

module.exports = noBodyAllowed;
