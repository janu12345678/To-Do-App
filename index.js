const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import uuid
const app = express();

// In-memory array to store tasks
let tasks = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('main', { tasks: tasks });
});

app.post('/add', (req, res) => {
    const task = req.body.task;
    if (task) {
        const newTask = { id: uuidv4(), name: task, checked: false };
        tasks.push(newTask);
    }
    res.redirect('/');
});

app.post('/update-state/:id', (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.checked = req.body.checked === 'true';
    }
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const taskId = req.params.id;
    tasks = tasks.filter(task => task.id !== taskId);
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        res.render('edit', { task: task });
    } else {
        res.status(404).send('Task not found');
    }
});

app.post('/update-task/:id', (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.name = req.body.task || task.name;
        res.redirect('/');
    } else {
        res.status(404).send('Task not found');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
