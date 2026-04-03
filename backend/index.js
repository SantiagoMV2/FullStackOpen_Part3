const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(cors())
app.use(express.json()) 
app.use(express.static("dist"))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

let currentDate = new Date()

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000)
  return randomId
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`
      <p>Phonebook has info of ${persons.length} people</p>
      <p>${currentDate}</p>
      `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
      return res.json(person) 
    } else {
      res.status(404).send("Put a valid ID to find the person's info you're looking for")
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    const checkRepeated = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase()) 

    if (!body.name) {
      return res.status(404).json({
        error: "name is missing"
      })
    } else if (!body.number) {
      return res.status(404).json({
        error: "number is missing"
      })
    } else if (checkRepeated) {
      return res.status(404).json({
        error: "name must be unique"
      })
    }

    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }

    persons = persons.concat(person) 
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.statusMessage = "Key: " + id + " deleted successfully "
    res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
})