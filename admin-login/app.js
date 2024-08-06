const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Dummy admin data (username: admin, password: admin)
const adminUsername = 'admin';
const adminPasswordHash = bcrypt.hashSync('admin', 10); // Hash the password

// Dummy car data
let cars = [
  { id: 1, name: 'Toyota Corolla', year: 2020, price: 20000 },
  { id: 2, name: 'Honda Civic', year: 2019, price: 22000 },
  { id: 3, name: 'Ford Focus', year: 2018, price: 18000 }
];

// Login route
app.get('/login', (req, res) => {
  res.render('login', { title: 'Assignment for Quadiro Technologies' });
});

// Login form submission route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received username:', username);
    console.log('Received password:', password);
  
    if (username === adminUsername && await bcrypt.compare(password, adminPasswordHash)) {
      console.log('Login successful');
      res.redirect('/cars');
    } else {
      console.log('Login failed');
      res.send('Login failed');
    }
  });
  
// Car routes
app.get('/cars', (req, res) => {
    try {
      res.render('cars/index', { cars });
    } catch (err) {
      console.error('Error rendering /cars page:', err);
      res.status(500).send('Error rendering page');
    }
  });
  
  

app.get('/cars/create', (req, res) => {
  res.render('cars/create');
});

app.post('/cars/create', (req, res) => {
  const { name, year, price } = req.body;
  const id = cars.length ? cars[cars.length - 1].id + 1 : 1;
  cars.push({ id, name, year, price });
  res.redirect('/cars');
});

app.get('/cars/edit/:id', (req, res) => {
  const car = cars.find(c => c.id == req.params.id);
  res.render('cars/edit', { car });
});

app.post('/cars/edit/:id', (req, res) => {
  const { id, name, year, price } = req.body;
  const carIndex = cars.findIndex(c => c.id == id);
  cars[carIndex] = { id: parseInt(id), name, year, price };
  res.redirect('/cars');
});

app.post('/cars/delete/:id', (req, res) => {
  cars = cars.filter(c => c.id != req.params.id);
  res.redirect('/cars');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
