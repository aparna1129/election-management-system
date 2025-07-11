import './load-env.js';

console.log('=== Environment Variables Test ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : '***NOT SET***');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : '***NOT SET***');
console.log('PORT:', process.env.PORT);

// Test database connection
import db from './config/db.js';

try {
  const connection = await db.getConnection();
  console.log('✅ Database connection successful!');
  connection.release();
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
} 