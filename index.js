const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const {
  Server
} = require('socket.io')

const io = new Server(server)
// Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  console.log("User Connected")
  socket.on('on-chat', data => {
    console.log(data)
    io.emit('bitcoin-user-chat', data)
  })
})

server.listen(3000, () => {
  console.log("Listinng on 3000")
})