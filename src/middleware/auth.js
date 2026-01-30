const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    
    if (!userRole) {
      return res.status(401).json({ error: 'Role tidak ditemukan di header' });
    }
    
    if (userRole !== requiredRole) {
      return res.status(403).json({ 
        error: `Akses ditolak. Hanya role ${requiredRole} yang diizinkan` 
      });
    }
    
    next();
  };
};

const checkUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'User ID tidak ditemukan di header' });
  }
  
  req.userId = parseInt(userId);
  next();
};

module.exports = { checkRole, checkUser };