const express = require('express');
const itemModel = require('./models/item');
const userModel = require('./models/user');
const user = require('./models/user');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Home Route
app.get('/', (req, res) => {
    res.redirect('login');
});

// Main route
app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await userModel.findOne({email});
        const tasks = await itemModel.find({ userId: user._id }); 
        res.render('main', { tasks });
    } catch (error) {
        res.status(500).send('Error fetching tasks');
    }
});

app.get('/login', (req,res) => {
    res.render('login');
})

app.get('/register', (req,res) => {
    res.render('register');
})

// Register route
app.post('/register', async (req,res) => {
    const {username, email, password} = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send('You are already registered. Please login to checkout the website');

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err,hash) => {
            let user = await userModel.create({
                username,
                email,
                password: hash
            })

            let token = jwt.sign({email: email, id: user._id}, "todoapp");
            res.cookie("token", token);
            res.redirect('/login');
        })
    })
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });

        // If user is not found, render error and return to stop further execution
        if (!user) {
            return res.render('error', { message: 'Something went wrong. Please login again' });
        }

        // Compare passwords
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.render('error', { message: 'An unexpected error occurred. Please try again later.' });
            }

            if (result) {
                let token = jwt.sign({email: email, id: user._id}, "todoapp");
                res.cookie("token", token);
                return res.redirect('/profile');
            } else {
                return res.render('error', { message: 'Password/email entered is incorrect. Please login again' });
            }
        });
    } catch (err) {
        return res.render('error', { message: 'An unexpected error occurred. Please try again later.' });
    }
});

app.post('/logout', (req,res) => {
    res.cookie("token","");
    res.redirect('/login');
})

// Add Task Route
app.post('/add', isLoggedIn, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await userModel.findOne({email});
        // Create the task
        const taskName = req.body.task;
        await itemModel.create({
            taskName,
            checked: false,
            userId: user._id // Associate the task with the logged-in user
        });

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error adding task');
    }
});

// Update Task State Route
app.post('/update-state/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const checked = req.body.checked === 'true';
        await itemModel.findByIdAndUpdate(taskId, { checked });
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating task state:', error);
        res.status(500).send('Error updating task state');
    }
});

// Delete Task Route
app.post('/delete/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        await itemModel.findByIdAndDelete(taskId);
        res.redirect('/profile');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Error deleting task');
    }
});

// Edit Task Route
app.get('/edit/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await itemModel.findById(taskId);
        if (task) {
            res.render('edit', { task });
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        console.error('Error fetching task for editing:', error);
        res.status(500).send('Error fetching task for editing');
    }
});

// Update Task Route
app.post('/update-task/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskName = req.body.task; // Updated task name
        await itemModel.findByIdAndUpdate(taskId, { taskName });
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Error updating task');
    }
});

function isLoggedIn(req,res,next){
    const cookie = req.cookies.token;
    if(cookie === "") {
        return res.render('error', {message: 'you must login!'});
    }else{
        let data = jwt.verify(cookie,"todoapp");
        req.user = data;
        next();
    }
}

// Start Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
