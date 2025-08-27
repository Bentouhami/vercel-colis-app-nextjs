const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const port = 3001; // Vous pouvez choisir un autre port si 3001 est déjà utilisé

// Chargez le fichier YAML de la spécification OpenAPI
const swaggerDocument = YAML.load(path.join(__dirname, 'analyses', 'OpenAPI_ColisApp.yaml'));

// Configurez Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Swagger UI disponible sur http://localhost:${port}/api-docs`);
});