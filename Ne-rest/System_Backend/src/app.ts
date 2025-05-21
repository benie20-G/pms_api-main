import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import http from 'http';
import router from './routes/index';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/doc/swagger.json';
import cors from 'cors'
import carRecordRoutes from "./routes/carRecordRoutes";
import { logger } from './loggers/logger';

// Load environment variables from .env file
config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

// Parse incoming JSON requests
app.use(express.json());
// Parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

// Mount all API routes under /api/v1
app.use('/api/v1', router);

// Mount car record routes under /api/car-records
app.use("/api/car-records", carRecordRoutes);

// Serve Swagger API documentation at /api/v1/docs
// @ts-ignore
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Handle 404 errors for undefined routes
app.use("*", (req, res) => {
    return res.status(404).json({ error: "Route not found" });
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
});