const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// API Configuration
const JOKE_API = 'https://official-joke-api.appspot.com';
const DAD_JOKE_API = 'https://icanhazdadjoke.com';

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Routes
app.get('/', async (req, res) => {
  try {
    // Get a random joke for the homepage
    const response = await axios.get(`${JOKE_API}/random_joke`);
    const featuredJoke = response.data;

    res.render('index', { 
      featuredJoke,
      jokes: null,
      selectedCategory: null,
      error: null 
    });
  } catch (error) {
    res.render('index', {
      featuredJoke: null,
      jokes: null,
      selectedCategory: null,
      error: 'Unable to load jokes at this time'
    });
  }
});

// Get random joke
app.get('/random', async (req, res) => {
  try {
    const response = await axios.get(`${JOKE_API}/random_joke`);
    const featuredJoke = response.data;

    res.render('index', {
      featuredJoke,
      jokes: null,
      selectedCategory: null,
      error: null
    });
  } catch (error) {
    res.render('index', {
      featuredJoke: null,
      jokes: null,
      selectedCategory: null,
      error: 'Unable to fetch random joke'
    });
  }
});

// Get dad joke
app.get('/dadjoke', async (req, res) => {
  try {
    const response = await axios.get(DAD_JOKE_API, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const dadJoke = {
      id: response.data.id,
      type: 'dad',
      setup: response.data.joke,
      punchline: '😄'
    };

    res.render('index', {
      featuredJoke: dadJoke,
      jokes: null,
      selectedCategory: null,
      error: null
    });
  } catch (error) {
    res.render('index', {
      featuredJoke: null,
      jokes: null,
      selectedCategory: null,
      error: 'Unable to fetch dad joke'
    });
  }
});

// Get jokes by category
app.get('/category/:type', async (req, res) => {
  const category = req.params.type;

  try {
    const response = await axios.get(`${JOKE_API}/jokes/${category}/ten`);
    const jokes = shuffleArray(response.data);

    res.render('index', {
      featuredJoke: null,
      jokes: jokes,
      selectedCategory: category,
      error: null
    });
  } catch (error) {
    res.render('index', {
      featuredJoke: null,
      jokes: null,
      selectedCategory: null,
      error: `Unable to fetch ${category} jokes`
    });
  }
});


// API endpoint for random joke (JSON)
app.get('/api/random', async (req, res) => {
  try {
    const response = await axios.get(`${JOKE_API}/random_joke`);
    res.json({
      success: true,
      joke: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching joke'
    });
  }
});

// API endpoint for jokes by category (JSON)
app.get('/api/category/:type', async (req, res) => {
  const category = req.params.type;

  try {
    const response = await axios.get(`${JOKE_API}/jokes/${category}/ten`);
    res.json({
      success: true,
      jokes: response.data,
      category: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching ${category} jokes`
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎭 Joke Generator running on http://localhost:${PORT}`);
  
});