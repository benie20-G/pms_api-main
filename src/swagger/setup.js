const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./index');

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'NE Parking Management System API Documentation'
    }));
};

module.exports = setupSwagger; 