const app = require('./app');

const port = process.env.port || 8000;

app.get('/', (req, res) => {
  res.send('Welcome to UrbanEdge');
});


app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});