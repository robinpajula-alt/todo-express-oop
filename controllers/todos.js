// CRUD = Create, Read, Update, Delete
import { Todo } from '../models/todo.js';
import { fileManager } from '../utils/files.js';

class todoController {
    constructor() {
        this.filePath = "./data/todos.json";
        // hold todo objects in array
        this.initTodos();
    } 

    async createTodo(req, res) {
        // get data from POST request
        const task = req.body.task;
        // create new object via Todo model
        // model constructor uses uniq id and task name as paramater
        const newTodo = new Todo(Math.random().toString(), task);
        // add new todo to todos array
        this.TODOS.push(newTodo);
        await fileManager.writeFile("./data/todos.json", this.TODOS);
        // create a correct response
        res.json({
            message: "Created new todo object",
            newTask: newTodo
        });
    }

    async updateTodo(req, res) {
        const todoId = req.params.id;
        const updatedTask = req.body.task;
        const updatedItem = await fileManager.updateTodo(this.filePath, todoId, updatedTask);
        if (!updatedItem) {
            return res.status(404).json({
                message: "Could not find todo with such id"
            });
        }
        await this.initTodos();
        res.json({
            message: "todo is updated",
            updatedTask: updatedItem
        });
    }

    async deleteTodo(req, res) {
        const todoId = req.params.id;

        const success = await fileManager.deleteTodo(this.filePath, todoId);

        if (!success) {
            return res.status(404).json({
                message: "Could not find todo with such id"
            });
        }

        await this.initTodos();

        res.json({
            message: "todo is deleted"
        });
    }

    async initTodos() {
        const todosData = await fileManager.readFile("./data/todos.json");
        if (todosData !== null) {
            this.TODOS = todosData;
        } else {
            this.TODOS = [];
        }  
    } 

    getTodos(req, res) {
        res.json({ tasks: this.TODOS });
    }
}

export const TodoController = new todoController();