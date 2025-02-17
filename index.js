const express = require('express');
const app = express();
app.use(express.json({ limit: '8mb' }));

const { sendEmail, sendEmailCompra } = require('./controller/email.controller');

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/send', sendEmail)

app.post('/sendEmailCompra', sendEmailCompra)


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});