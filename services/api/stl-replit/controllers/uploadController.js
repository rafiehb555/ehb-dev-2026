export const uploadKycDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "File is required" });
  return res.json({ message: "KYC document uploaded", file: req.file.filename });
};

export const uploadCrbDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "File is required" });
  return res.json({ message: "CRB document uploaded", file: req.file.filename });
};

