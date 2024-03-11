const { v4: uuid } = require('uuid');
const { pool } = require('../data/todoDatabase');
const { NotFoundError, ValidationError, DatabaseConnectionError } = require('./error');

class TodosRecord {
  // active record
  constructor(obj) {
    this.title = obj.title;
    this.id = obj.id;
    this.#validate();
  }

  #validate() {
    if (this.title.trim().length < 5) {
      throw new ValidationError('Todo title should be at least 5 characters');
    }

    if (this.title.length > 150) {
      throw new ValidationError('Todo title is too long, should be max 150 characters');
    }
  }

  async insert() {
    this.id = this.id ?? uuid();

    await pool.execute(
      'INSERT INTO `todos`(`id`, `title`) VALUES (:id, :title)',
      {
        id: this.id,
        title: this.title,
      },
    );

    return this.id;
  }

  async delete() {
    if (!this.id) {
      throw new NotFoundError('Record cannot be removed without id');
    }
    await pool.execute('DELETE FROM `todos` WHERE `id` = :id', {
      id: this.id,
    });
  }

  async update() {
    if (!this.id) {
      throw new NotFoundError('Todo item has no ID!');
    }
    this.#validate();
    await pool.execute('UPDATE `todos` SET `title` = :title WHERE `id` = :id', {
      title: this.title,
      id: this.id,
    });

    return this.id;
  }

  static async find(id) {
    const [result] = await pool.execute(
      'SELECT * FROM `todos` WHERE `id` = :id',
      {
        id,
      },
    );
    if (result[0]) {
      return new TodosRecord(result[0]);
    }
    throw new NotFoundError(`Task with id '${id}' doesn't exist`);
  }

  static async findAll() {
    try {
      const [results] = await pool.execute('SELECT * FROM `todos`');
      // console.log(Array.isArray(results));
      return results.map((row) => new TodosRecord(row));
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        throw new DatabaseConnectionError('No access to the Database');
      }
      throw err;
    }
  }
}

module.exports = {
  TodosRecord,
};
