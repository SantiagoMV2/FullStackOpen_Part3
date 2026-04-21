require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require('mongoose')
const app = express()
const Person = require('./models/person')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json()) 
app.use(express.static("dist"))

let currentDate = new Date()

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
    res.send(`
      <p>Phonebook has info of ${persons.length} people</p>
      <p>${currentDate}</p>
      `)
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => res.status(400).send({ error: 'malformatted id'}))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
      return res.status(400).json({
        error: 'name or number missing'
      })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
})