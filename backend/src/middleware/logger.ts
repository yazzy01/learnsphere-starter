import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override end function to log response time
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - start;
    
    // Only log in development or if explicitly enabled
    if (process.env.NODE_ENV === 'development' || process.env.ENABLE_REQUEST_LOGGING === 'true') {
      console.log(
        `${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
      );
    }
    
    // Call original end function
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};
