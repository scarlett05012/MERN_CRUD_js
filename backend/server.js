const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
const todoDB= 'todos';

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/'+todoDB, {useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('mongo db connection established successfully');
});

// GET
todoRoutes.route('/').get((req,res)=>{
    Todo.find((err,todoDB)=>{
        if(err){
            console.log(err);
        }else{
            res.json(todoDB);
        }
    });
});

todoRoutes.route('/:id').get((req,res)=>{
    let id = req.params.id;
    Todo.findById(id, (err,todo)=>{
        res.json(todo);
    });
});

// POST
todoRoutes.route('/add').post((req,res)=>{
    let todo = new Todo(req.body);

    // todo.todo_description = req.body.todo_description;
    // todo.todo_responsible = req.body.todo_responsible;
    // todo.todo_priority = req.body.todo_priority;
    // todo.todo_completed = req.body.todo_completed;
    todo.save().then(todo =>{
        res.status(200).json({'todo': 'todo added successfully'});
    }).catch(err =>{
        res.status(400).send('adding new todo failed');
    });
    
    console.log(todo);
    
});


// PUT
todoRoutes.route('/update/:id').put((req,res)=>{
    Todo.findById(req.params.id, (err,todo)=>{
        if(!todo){
            res.status(404).send('data is not found');
        }else{

            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo=>{
                res.json('Todo updated');
            }).catch(err =>{
                res.status(400).send('update not possible');
            });
        }
    });
});

app.use('/todos',todoRoutes);

app.listen(PORT, ()=>{
    console.log("server is running in port: "+PORT);
});