const express = require('express');
const { TodosRecord } = require('../records/todos.record');

const todoRouter = express.Router();

todoRouter
  .get('/', async (req, res, next) => {
    try {
      const todos = await TodosRecord.findAll();
      res.render('todos/list-all', {
        todos,
      });
    } catch (err) {
      next(err);
      //   console.log(err);
      //   res.status(500).render('errors/error', {
      //     // Używaj statusu 404 dla nieznalezionych zasobów
      //     message: err.message,
      //   });
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const todo = await TodosRecord.find(req.params.id);
      console.error(todo);
      res.render('todos/list-one', {
        todo,
      });
    } catch (err) {
      next(err);
      //   res.status(404).render('errors/error', {
      //     // Używaj statusu 404 dla nieznalezionych zasobów
      //     message: err.message,
      //   });
    }
  })

  .post('/', async (req, res, next) => {
    try {
      const { title } = req.body;
      const newTodo = new TodosRecord({ title });
      await newTodo.insert();
      // res.redirect('/');
      res.render('todos/added', {
        id: newTodo.id,
        title: newTodo.title,
      });
    } catch (err) {
      next(err);
      //   res.status(400).render('errors/error', {
      //     message: err.message,
      //   });
    }
  })

  .delete('/delete/:id', async (req, res, next) => {
    try {
      const todoId = req.params.id;
      const todoToDelete = await TodosRecord.find(todoId);
      await todoToDelete.delete();
      res.render('todos/deleted', {
        todo: todoToDelete,
      });
    } catch (err) {
      next(err);
      //   console.error(err);
      //   res.status(404).render('errors/error', {
      //     message: err.message,
      //   });
    }
  })

  .delete('/delete/', async (req, res) => {
    res.status(400).render('errors/error', {
      message: 'No ID provided for deletion',
    });
  })

  .get('/form/addTodo', async (req, res) => {
    res.render('todos/form/addTodo');
  })
  .use('*', (req, res) => {
    res.status(404).render('errors/error', {
      message: 'Page not found',
    });
  });

module.exports = {
  todoRouter,
};
