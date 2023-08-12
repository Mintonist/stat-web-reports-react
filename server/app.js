const express = require('express');
const chalk = require('chalk');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const initDatabase = require('./startup/initDatabase.js');
const routes = require('./routes');

const PORT = config.get('port') ?? 8080;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.json());
app.use('/api', routes);
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(
  express.urlencoded({
    extended: false,
  })
);

async function start() {
  try {
    mongoose.connection.once('open', () => {
      initDatabase();
    });

    await mongoose.connect(config.get('mongoUrl'));
    console.log(chalk.yellow(`MongoDB connected!`));
  } catch (e) {
    console.log('ERROR', e.message);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(chalk.green(`Server has been started on port ${PORT}. ENV_MODE = ${process.env.NODE_ENV}`));
  });
}

start();
