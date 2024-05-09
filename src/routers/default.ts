import express from 'express';

export const defaultRouter = express.Router();

/**
 * Handles all requests to any route that hasn't been implemented.
 * This middleware function will catch all types of HTTP methods (GET, POST, PUT, DELETE, etc.).
 *
 * @param {express.Request} _ The request object. It is not used in the function, hence it's prefixed with an underscore.
 * @param {express.Response} res The response object used to send back the HTTP response.
 */
defaultRouter.all('*', (_, res) => {
  res.status(501).send('Route not implemented');
});