import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({
  origin: (origin, callback) => {
    // Allow tools such as curl/Postman (no Origin) and the configured frontend.
    if (!origin || origin === CLIENT_URL || process.env.NODE_ENV !== 'production') return callback(null, true)
    return callback(new Error('Origin not allowed by CORS'))
  },
}))
app.use(express.json({ limit: '1mb' }))

const products = [
  { _id: 'p1', name: 'Classic Black Hoodie', category: 'Hoodies', price: 1899, oldPrice: 2299, rating: 4.8, badge: 'BEST SELLER', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85', description: 'A relaxed-fit everyday hoodie with a soft brushed finish.' },
  { _id: 'p2', name: 'Everyday Navy Hoodie', category: 'Hoodies', price: 1799, oldPrice: null, rating: 4.7, badge: '', image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85', description: 'A clean, comfortable layer in a deep navy colourway.' },
  { _id: 'p3', name: 'Cloud Grey Sweatshirt', category: 'Sweatshirts', price: 1599, oldPrice: null, rating: 4.6, badge: 'NEW', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85', description: 'An easy everyday sweatshirt with a soft, timeless silhouette.' },
  { _id: 'p4', name: 'Forest Green Hoodie', category: 'Hoodies', price: 1899, oldPrice: null, rating: 4.8, badge: '', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85', description: 'A rich green staple made for casual days and layered looks.' },
  { _id: 'p5', name: 'Cream Essential Tee', category: 'T-Shirts', price: 899, oldPrice: 1099, rating: 4.7, badge: '', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85', description: 'A versatile cotton tee designed to go with everything.' },
  { _id: 'p6', name: 'Rose Pink Sweatshirt', category: 'Sweatshirts', price: 1499, oldPrice: null, rating: 4.5, badge: '', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=85', description: 'A muted pink layer that adds a soft touch to your rotation.' },
  { _id: 'p7', name: 'Graphic Outdoor Tee', category: 'T-Shirts', price: 999, oldPrice: null, rating: 4.8, badge: 'FEATURED', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85', description: 'A statement graphic tee inspired by outdoor adventures.' },
  { _id: 'p8', name: 'Sunset Orange Tee', category: 'T-Shirts', price: 899, oldPrice: null, rating: 4.4, badge: '', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=85', description: 'A bright pop of colour for an easy, relaxed look.' },
]

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    address: { type: String, required: true, trim: true, maxlength: 500 },
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 99 },
  }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, default: 'Demo order received' },
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

app.get('/', (_req, res) => res.json({ name: 'ShopNova API', status: 'running', endpoints: ['/health', '/api/products', '/api/orders'] }))
app.get('/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected' }))
app.get('/api/products', (_req, res) => res.json(products))

app.post('/api/orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Order saving needs MongoDB. Configure MONGODB_URI in server/.env or your hosting environment.' })
    }

    const { customer, items } = req.body || {}
    if (!customer?.name?.trim() || !customer?.email?.trim() || !customer?.address?.trim()) {
      return res.status(400).json({ message: 'Please provide your name, email, and delivery address.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
      return res.status(400).json({ message: 'Your bag is empty or contains too many items.' })
    }

    // Prices are recalculated on the server; never trust totals sent by a browser.
    const validatedItems = []
    for (const item of items) {
      const product = products.find((p) => p._id === item.productId)
      const quantity = Number(item.quantity)
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ message: 'One of the items in your bag is invalid. Please refresh and try again.' })
      }
      validatedItems.push({ productId: product._id, name: product.name, price: product.price, quantity })
    }
    const total = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const orderNumber = `SN-${Date.now().toString().slice(-8)}`
    const order = await Order.create({
      orderNumber,
      customer: { name: customer.name, email: customer.email, address: customer.address },
      items: validatedItems,
      total,
    })
    return res.status(201).json({ message: 'Demo order created successfully.', orderNumber: order.orderNumber, _id: order._id, total: order.total })
  } catch (error) {
    console.error('Order creation error:', error)
    return res.status(500).json({ message: 'Something went wrong while saving your order.' })
  }
})

app.use((err, _req, res, _next) => {
  if (err.message === 'Origin not allowed by CORS') return res.status(403).json({ message: 'This website origin is not allowed by the API.' })
  console.error(err)
  res.status(500).json({ message: 'Unexpected server error.' })
})

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('MongoDB connected successfully')
    } catch (error) {
      console.error('MongoDB connection failed:', error.message)
      console.error('Product browsing will still work, but orders cannot be saved.')
    }
  } else {
    console.warn('MONGODB_URI not set. Product browsing works; order checkout requires MongoDB.')
  }
  app.listen(PORT, () => console.log(`ShopNova API running on port ${PORT}`))
}

start()
