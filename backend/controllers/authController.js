const jwt = require('jsonwebtoken');

const JWT_SECRET = 'defectiq-super-secret-key-2026';

const users = [
  { id: 'usr-1', email: 'engineer@factory.com', password: 'password123', name: 'Sai pravardhan estati', role: 'Quality Engineer', department: 'Quality Assurance' },
  { id: 'usr-2', email: 'manager@factory.com', password: 'password123', name: 'Priyatham bondu', role: 'Production Manager', department: 'Operations' },
  { id: 'usr-3', email: 'admin@factory.com', password: 'password123', name: 'Naveed shaik', role: 'Plant Administrator', department: 'Executive Office' }
];

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    }
  });
};

exports.getMe = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
