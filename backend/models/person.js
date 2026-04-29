const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          const parts = v.split('-')
          if (parts.length !== 2) return false

          const [first, second] = parts
          const numbersOnly = /^[0-9]+$/

          return numbersOnly.test(first) && 
          numbersOnly.test(second) && 
          first.length >= 2 &&
          first.length <= 3 &&
          second.length >= 6
        },
      message: props => `${props.value} is not a valid phone number`
      }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)