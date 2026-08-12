const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`API executando em http://localhost:${config.port}`);
  console.log(`Swagger disponível em http://localhost:${config.port}/api-docs`);
});
