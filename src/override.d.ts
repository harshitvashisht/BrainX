export {}; 
// Extending the Express Request interface to include a custom property (`userId`).
declare global {
    namespace Express {
        // The Request interface from the Express module is being extended here.
        export interface Request {
            userId?: string; // Adds an optional `userId` property to the Request object.
        }
    }
}