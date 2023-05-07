const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const {
  Server
} = require('socket.io')

const delay = require('delay')
const io = new Server(server)
const axios = require('axios');
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

async function broadcastBitcoinPriceSubscribers() {
  while (true) {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    io.emit('bitcoin-price', { price: parseFloat(response.data.price) })
    delay(100)
  }
}

broadcastBitcoinPriceSubscribers()