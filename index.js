const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const {
  Server
} = require('socket.io')

const {
  WebSocket
} = require('ws');



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
    const response = await axios.get('https://bscexchange.finance/api/v1/fimarketcap/markets/84501')
    bitcoinPrice = response.data.current_price
    if (lastPrice !== bitcoinPrice) {
      io.emit('bitcoin-price', { price: parseFloat(bitcoinPrice) })
      lastPrice = bitcoinPrice
    }
    delay(500)
  }
}

function connectBinanceSocket() {
  const coin = 'btcusdt';
  const binanceSocket = new WebSocket(`wss://fstream.binance.com/ws/${coin}@trade`);
  binanceSocket.on('message', data => {
    if (data) {
      const trade = JSON.parse(data);
      console.log(trade);
      binanceSocket.emit('binance-bitcoin-price', { data: trade })
      delay(5000)
    }
  });
  
}

broadcastBitcoinPriceSubscribers()
connectBinanceSocket()