// Middleware for token validation
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token given.', tokeen: token});
      }
      req.user = decoded;
      next();
    });
  }

  module.exports = {
    authenticateToken
  }