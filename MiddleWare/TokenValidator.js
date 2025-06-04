import Retell from "retell-sdk";

export const validateApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Missing or invalid Authorization header"
    });
  }

  const apiKey = authHeader.split(" ")[1];
  if (!apiKey) {
    return res.status(401).json({
      status: false,
      message: "API key not provided"
    });
  }

  try {
    req.retellClient = new Retell({ apiKey });
    next();
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Failed to initialize Retell client",
      error: err.message
    });
  }
};