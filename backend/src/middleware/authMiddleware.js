import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("token not recevied");
    return res
      .status(401)
      .json({ error: "Something went wrong! please login again" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    console.log("token not recevied", err);
    return res
      .status(401)
      .json({ error: "Something went wrong! please login again" });
  }
};

export default authMiddleware;
