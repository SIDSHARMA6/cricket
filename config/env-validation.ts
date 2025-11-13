/**
 * Environment variable validation
 * Ensures all required environment variables are set before starting the server
 */

const requiredEnvVars = [
  'APP_KEYS',
  'API_TOKEN_SALT',
  'ADMIN_JWT_SECRET',
  'JWT_SECRET',
  'DATABASE_CLIENT',
];

const productionEnvVars = [
  'DATABASE_URL',
  'CLOUDINARY_NAME',
  'CLOUDINARY_KEY',
  'CLOUDINARY_SECRET',
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }
  
  console.log('✅ All required environment variables are set');
  
  // Warn about missing production variables
  if (process.env.NODE_ENV === 'production') {
    const missingProd = productionEnvVars.filter(key => !process.env[key]);
    if (missingProd.length > 0) {
      console.warn(
        `⚠️  Missing recommended production environment variables: ${missingProd.join(', ')}`
      );
    }
  }
};
