const express = require('express');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
const { handleError } = require('./records/error');

const { homeRouter } = require('./routers/home');
const { todoRouter } = require('./routers/todosRouter');

const app = express();
const PORT = 3000;

app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static('public'));

app.engine(
  '.hbs',
  hbs.engine({
    extname: '.hbs',
  }),
);
app.set('view engine', '.hbs');
app.set('views', './views');

app.use('/', homeRouter);
app.use('/todos', todoRouter);

app.use(handleError);

app.listen(PORT, 'localhost', () => {
  console.log(`listening on ${PORT}`);
});
