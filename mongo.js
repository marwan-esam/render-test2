const mongoose = require('mongoose')

if(process.argv.length < 3) {
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]


const url = `mongodb+srv://fullstack:${password}@cluster0.gf5bdk6.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, {family: 4})

const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5) {
    const person = new Person({
        name,
        phone,
    })
    
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.phone} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.phone}`)
        })
        mongoose.connection.close()
    })
}
