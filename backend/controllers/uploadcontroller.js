exports.uploadCode = (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded"
    });
  }

  const allowedTypes = [".js", ".py", ".java"];

  const fileName = req.file.originalname;

  const valid = allowedTypes.some(type => fileName.endsWith(type));

  if (!valid) {
    return res.status(400).json({
      message: "Invalid file type"
    });
  }

  res.json({
    message: "File uploaded successfully",
    file: req.file.filename
  });
};