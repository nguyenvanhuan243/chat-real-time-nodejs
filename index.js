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
  let lastPrice = 0
  let bitcoinPrice = 0
  while (true) {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    bitcoinPrice = response.data.price
    if (lastPrice !== bitcoinPrice) {
      io.emit('bitcoin-price', { price: parseFloat(bitcoinPrice) })
      lastPrice = bitcoinPrice
    }
    delay(500)
  }
}

broadcastBitcoinPriceSubscribers()