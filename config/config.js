require('dotenv').config();

module.exports = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // MongoDB Configuration
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/disaster-management',
    
    // API Keys
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
    
    // Email Configuration (for alerts)
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_EMAIL: process.env.SMTP_EMAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    
    // Service URLs
    serviceUrls: {
        transport: '/api/transport',
        news: '/api/news',
        safetyMap: '/api/safety-map',
        auth: '/api/auth',
        alerts: '/api/alerts'
    }
}; 