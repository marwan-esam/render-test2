require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (request, response) => request.method === 'POST' ? JSON.stringify(request.body) : ' ')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

const generateId = () => {
    return String(Math.floor(Math.random() * 1000000))
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    // const id = request.params.id
    // const person = persons.find(person => person.id === id)
    // if(person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id)
    .then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = request.params.id
    // persons = persons.filter(person => person.id !== id)

    // response.status(204).end()
    Person.findByIdAndDelete(request.params.id)
    .then(person => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    // const isPersonFound = persons.find(person => person.name === body.name)
    // if(!body.name || !body.number) {
    //     return response.status(400).json({
    //         error: "missing name or number"
    //     })
    // }
    // if(isPersonFound) {
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    // }
    // const person = {
    //     name: body.name,
    //     number: body.number,
    //     id: generateId() 
    // }
    // persons = persons.concat(person)
    // response.json(person)
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Person.findById(request.params.id)
    .then(person => {
        if(!person) {
            return response.status(404).end()
        }

        person.name = name
        person.number = number

        return person.save()
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformmated id'})
    }

    if(error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)

}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})