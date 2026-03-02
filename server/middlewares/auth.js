import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    // Cookie-parser ki wajah se hum direct req.cookies read kar sakte hain
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).send("Access Denied. Bhai pehle login kar!");
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // User ka ID aur Role request mein daal diya
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};