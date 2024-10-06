const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();

// Middleware to parse JSON body
app.use(express.json());

// Create new html file named home.html
fs.writeFileSync(path.join(__dirname, 'home.html'), '<h1>Welcome to ExpressJs Tutorial</h1>');

/*
- Return home.html page to client
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html')); // Serve home.html file
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Error reading file' });
    }
    res.json(JSON.parse(data)); // Send the user.json data as JSON
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and password are valid, send response as:
    {
        status: true,
        message: "User is valid"
    }
- If username is invalid, send response as:
    {
        status: false,
        message: "User Name is invalid"
    }
- If password is invalid, send response as:
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body; // Extract username and password from body
  
  // Read user data from user.json
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Error reading file' });
    }

    const users = JSON.parse(data);
    const user = users.find(user => user.username === username);
    
    if (!user) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }
    
    if (user.password !== password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }

    res.json({ status: true, message: 'User is valid' });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logged out.</b>
*/
router.get('/logout', (req, res) => {
  const username = req.query.username; // Get username from query parameters
  if (username) {
    res.send(`<b>${username} successfully logged out.</b>`);
  } else {
    res.send('<b>Username is required to logout.</b>');
  }
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.use('/', router);

app.listen(process.env.port || 8082, () => {
  console.log('Web Server is listening at port ' + (process.env.port || 8082));
});
