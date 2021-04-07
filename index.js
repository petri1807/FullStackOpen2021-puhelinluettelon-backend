const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(
  morgan(':method :status :res[content-length] - :response-time ms :person')
);

morgan.token('person', (req, res) => JSON.stringify(req.body));

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

const generateId = () => {
  // const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  const num = Math.floor(Math.random() * 10000);
  return num;
};

// MAIN PAGE
app.get('/', (req, res) => {
  res.send(
    '<h1>Puhelinluettelo REST API created with Node.js and Express</h1>'
  );
});

// PERSONS
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) res.json(person);
  else res.status(404).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  // Missing name
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    });
  }

  // Missing number
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }

  // Contact already in phonebook
  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = [...persons, person];

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

// INFO
app.get('/api/info', (req, res) => {
  const message = `<p>Phonebook has information for ${
    persons.length
  } people</p><br><p>${new Date()}</p>`;
  res.send(message);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
