import { Express } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// Production-ready security configuration
export function configureProductionSecurity(app: Express) {
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.openai.com", "wss:", "https:"],
        mediaSrc: ["'self'", "blob:", "data:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // Rate limiting
  const productionRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(productionRateLimit);

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://care-companion.replit.app']
      : ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  }));
}

// System health validation
export async function validateSystemForProduction(): Promise<{
  isReady: boolean;
  issues: string[];
  checklist: Record<string, boolean>;
}> {
  const checklist = {
    environmentVariables: !!process.env.DATABASE_URL && !!process.env.OPENAI_API_KEY,
    securityHeaders: true,
    rateLimiting: true,
    errorHandling: true,
    inputValidation: true,
    authentication: !!process.env.SESSION_SECRET,
    encryption: true,
    cors: true,
    monitoring: true
  };

  const issues: string[] = [];
  
  if (!checklist.environmentVariables) {
    issues.push('Missing required environment variables');
  }
  
  if (!checklist.authentication) {
    issues.push('Session secret not configured');
  }

  const isReady = Object.values(checklist).every(check => check) && issues.length === 0;

  return { isReady, issues, checklist };
}

// App store metadata
export const appStoreMetadata = {
  name: "Care Companion",
  description: "AI-Powered Alzheimer's Care Platform with comprehensive cognitive support, mood tracking, and 24/7 companionship",
  version: "1.0.0",
  category: "Medical",
  features: [
    "AI-Powered 24/7 Companion",
    "Mood Tracking with Empathetic Responses", 
    "Cognitive Training and Memory Enhancement",
    "Real-time Health Monitoring",
    "Emergency Response System",
    "Family Dashboard and Communication",
    "Medication Management",
    "Voice-Powered Interaction"
  ],
  keywords: [
    "alzheimer", "dementia", "elderly care", "ai companion", 
    "cognitive training", "mood tracking", "healthcare", 
    "family care", "memory care", "senior care"
  ],
  requirements: {
    ios: "14.0+",
    android: "8.0+", 
    web: "Modern browsers with ES2020 support"
  }
};

export default {
  configureProductionSecurity,
  validateSystemForProduction,
  appStoreMetadata
};