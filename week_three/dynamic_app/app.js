(async () => {
  require('dotenv').config()
  const mongoose = require('mongoose')
  const { Client } = require('pg')
  let client = new Client({ database: 'first_name' })
  await client.connect()

  const url = process.env.MONGO_URI

  mongoose.connect(url)

  const lastNameSchema = new mongoose.Schema({
    content: String,
  })

  const LastName = mongoose.model('Name', lastNameSchema)

  const lastName = new LastName({
    content: "Ramirez"
  })

  const lastName2 = new LastName({ content: "Thomas" })

  lastName.save()
  lastName2.save()

  let data = await client.query('SELECT * from names')

  const express = require('express')

  const app = express()

  app.get('/', (req, res) => {
    let str = "<h1>First names using postgres</h1>"
    data.rows.forEach(ele => {
      str += `<h2>${ele.name}</h2>`
    })

    res.send(str)
  })

  app.get('/mongo', (req, res) => {
    (async () => {
      let str = "<h1>Last Names with mongo</h1>"
      let names = await LastName.find({})

      names.forEach(name => {
        str += `<h2>${name.content}</h2>`
      })

      res.send(str)
    })()
  })

  const PORT = 4001

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  client.end()
})()
