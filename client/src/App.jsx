import { useEffect, useMemo, useState } from 'react'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const productsFallback = [
  { _id: 'p1', name: 'Classic Black Hoodie', category: 'Hoodies', price: 1899, oldPrice: 2299, rating: 4.8, badge: 'BEST SELLER', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85', description: 'A relaxed-fit everyday hoodie with a soft brushed finish.' },
  { _id: 'p2', name: 'Everyday Navy Hoodie', category: 'Hoodies', price: 1799, oldPrice: null, rating: 4.7, badge: '', image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85', description: 'A clean, comfortable layer in a deep navy colourway.' },
  { _id: 'p3', name: 'Cloud Grey Sweatshirt', category: 'Sweatshirts', price: 1599, oldPrice: null, rating: 4.6, badge: 'NEW', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85', description: 'An easy everyday sweatshirt with a soft, timeless silhouette.' },
  { _id: 'p4', name: 'Forest Green Hoodie', category: 'Hoodies', price: 1899, oldPrice: null, rating: 4.8, badge: '', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85', description: 'A rich green staple made for casual days and layered looks.' },
  { _id: 'p5', name: 'Cream Essential Tee', category: 'T-Shirts', price: 899, oldPrice: 1099, rating: 4.7, badge: '', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85', description: 'A versatile cotton tee designed to go with everything.' },
  { _id: 'p6', name: 'Rose Pink Sweatshirt', category: 'Sweatshirts', price: 1499, oldPrice: null, rating: 4.5, badge: '', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=85', description: 'A muted pink layer that adds a soft touch to your rotation.' },
  { _id: 'p7', name: 'Graphic Outdoor Tee', category: 'T-Shirts', price: 999, oldPrice: null, rating: 4.8, badge: 'FEATURED', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85', description: 'A statement graphic tee inspired by outdoor adventures.' },
  { _id: 'p8', name: 'Sunset Orange Tee', category: 'T-Shirts', price: 899, oldPrice: null, rating: 4.4, badge: '', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=85', description: 'A bright pop of colour for an easy, relaxed look.' },
]

const categories = ['All', 'Hoodies', 'Sweatshirts', 'T-Shirts']
const money = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function App() {
  const [products, setProducts] = useState(productsFallback)
  const [cart, setCart] = useState([])
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [customer, setCustomer] = useState({ name: '', email: '', address: '' })
  const [busy, setBusy] = useState(false)
  const [railIndex, setRailIndex] = useState(0)

  useEffect(() => {
    fetch(`${API_URL}/api/products`).then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { if (Array.isArray(data) && data.length) {
        // The local fashion catalogue is the visual reference; use backend products only if they are fashion products.
        const fashion = data.filter(p => ['Hoodies', 'Sweatshirts', 'T-Shirts'].includes(p.category))
        if (fashion.length) setProducts(fashion)
      }}).catch(() => {})
  }, [])

  const shown = useMemo(() => products.filter(p =>
    (category === 'All' || p.category === category) &&
    `${p.name} ${p.category} ${p.description || ''}`.toLowerCase().includes(query.toLowerCase())
  ), [products, category, query])
  const count = cart.reduce((n, item) => n + item.quantity, 0)
  const total = cart.reduce((n, item) => n + item.price * item.quantity, 0)

  function add(product) {
    setCart(old => {
      const existing = old.find(item => item._id === product._id)
      return existing ? old.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...old, { ...product, quantity: 1 }]
    })
    setNotice(`${product.name} added to your bag`)
    setTimeout(() => setNotice(''), 2500)
  }
  function quantity(id, delta) {
    setCart(old => old.map(item => item._id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0))
  }
  async function checkout(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const r = await fetch(`${API_URL}/api/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, items: cart.map(({ _id, name, price, quantity }) => ({ productId: _id, name, price, quantity })), total })
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(data.message || 'Could not save the demo order. Check MongoDB configuration.')
      setNotice(`Thank you! Demo order ${data.orderNumber || ''} received.`)
      setCart([]); setCheckoutOpen(false); setCartOpen(false); setCustomer({ name: '', email: '', address: '' })
    } catch (err) { setNotice(err.message || 'Could not place order.') }
    finally { setBusy(false); setTimeout(() => setNotice(''), 5000) }
  }

  return <div className="page">
    <div className="topline">COMPLIMENTARY SHIPPING ON ORDERS OVER ₹2,000 <span>✦</span> NEW SEASON COLLECTION</div>
    <header className="masthead">
      <a href="#" className="wordmark" aria-label="LARANA Studios home">LARANA<span>Studios.</span></a>
      <button className="mobile-bag" onClick={() => setCartOpen(true)}>Bag ({count})</button>
    </header>
    <nav className="nav">
      <a href="#">Home</a><a href="#collections">Collections</a><a href="#about">About</a><a href="#journal">Blog</a><a href="#contact">Contact</a>
      <button onClick={() => setCartOpen(true)} className="nav-bag">Shopping Bag ({count})</button>
    </nav>
    <main>
      <section className="intro">
        <p className="eyebrow">NEW COLLECTION <span>/</span> PREMIUM STREETWEAR</p>
        <h1>Everyday staples.<br /><em>Made to be lived in.</em></h1>
        <p className="intro-text">Easy layers, considered colours, and the pieces you'll keep reaching for.</p>
      </section>
      <section className="rail-section" aria-label="Featured clothing carousel">
        <button className="rail-arrow rail-prev" onClick={() => setRailIndex(i => Math.max(0, i - 1))} aria-label="Previous shirts">‹</button>
        <div className="rail-viewport">
          <div className="rail-track" style={{ transform: `translateX(calc(var(--rail-step) * -${railIndex}))` }}>
            {products.map((p, i) => <button className="rail-item" key={p._id} onClick={() => setSelected(p)} aria-label={`View ${p.name}`}>
              <div className={`rail-image rail-tone-${i}`}><img src={p.image} alt={p.name} /></div>
              <span className="rail-name">{p.name}</span>
            </button>)}
          </div>
        </div>
        <button className="rail-arrow rail-next" onClick={() => setRailIndex(i => Math.min(Math.max(0, products.length - 4), i + 1))} aria-label="Next shirts">›</button>
      </section>
      <div className="feature-caption"><span>01 — THE DAILY UNIFORM</span><span>SLIDE TO EXPLORE THE COLLECTION&nbsp; ↔</span></div>

      <section className="collection" id="collections">
        <div className="section-head"><div><p className="eyebrow">THE LARANA EDIT</p><h2>Shop the <em>collection.</em></h2></div><p>Comfort first. Always in style.</p></div>
        <div className="controls">
          <div className="filters">{categories.map(c => <button key={c} className={category === c ? 'filter active' : 'filter'} onClick={() => setCategory(c)}>{c}</button>)}</div>
          <label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find your fit..." aria-label="Search products" /></label>
        </div>
        <div className="grid">
          {shown.map(p => <article className="product" key={p._id}>
            <button className="product-photo" onClick={() => setSelected(p)}>
              <img src={p.image} alt={p.name} loading="lazy" />
              {p.badge && <span className="badge">{p.badge}</span>}
              <span className="add-icon" onClick={e => { e.stopPropagation(); add(p) }} role="button" tabIndex="0" aria-label={`Add ${p.name} to bag`}>+</span>
            </button>
            <div className="product-meta"><div><span className="category-label">{p.category}</span><h3>{p.name}</h3></div><div className="price">{money(p.price)}{p.oldPrice && <del>{money(p.oldPrice)}</del>}</div></div>
            <div className="rating"><span>★★★★★</span> <small>{p.rating || '4.8'} / 5</small></div>
          </article>)}
        </div>
        {!shown.length && <p className="no-results">No pieces found. Try another search.</p>}
      </section>

      <section className="about" id="about"><div className="about-photo"><img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85" alt="Casual clothing collection" /></div><div className="about-copy"><p className="eyebrow">OUR PHILOSOPHY</p><h2>Good clothes.<br /><em>Good energy.</em></h2><p>LARANA Studios is built around the pieces that make getting dressed feel effortless. Thoughtful fits, everyday comfort, and colours that belong in your wardrobe.</p><a href="#collections">Explore the collection <span>↗</span></a></div></section>
      <section className="newsletter" id="journal"><div><p className="eyebrow">STAY IN THE LOOP</p><h2>Notes from<br /><em>the studio.</em></h2></div><form onSubmit={e => { e.preventDefault(); setNotice('You’re on the list — thank you!'); e.currentTarget.reset(); setTimeout(() => setNotice(''), 3000) }}><p>New drops, styling notes, and little updates from us.</p><div><input type="email" placeholder="Your email address" required aria-label="Your email address" /><button aria-label="Subscribe">→</button></div></form></section>
    </main>
    <footer id="contact"><a href="#" className="wordmark">LARANA<span>Studios.</span></a><p>Everyday pieces, thoughtfully made. © {new Date().getFullYear()} LARANA Studios.</p><div><a href="#collections">Collections</a><a href="#about">About</a><a href="mailto:hello@laranastudios.example">Contact</a></div></footer>
    {notice && <div className="toast" role="status">{notice}</div>}
    {selected && <div className="overlay" onClick={() => setSelected(null)}><section className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)}>×</button><img src={selected.image} alt={selected.name} /><div className="modal-copy"><p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><strong>{money(selected.price)}</strong><p>{selected.description}</p><button className="dark-button" onClick={() => { add(selected); setSelected(null); setCartOpen(true) }}>Add to bag — {money(selected.price)}</button><small>Easy everyday style · Demo store</small></div></section></div>}
    {cartOpen && <div className="overlay drawer-overlay" onClick={() => setCartOpen(false)}><aside className="drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag ({count})</h2></div><button className="close" onClick={() => setCartOpen(false)}>×</button></div>
      {cart.length ? <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item._id}><img src={item.image} alt={item.name} /><div><h3>{item.name}</h3><p>{money(item.price)}</p><div className="qty"><button onClick={() => quantity(item._id, -1)}>−</button><span>{item.quantity}</span><button onClick={() => quantity(item._id, 1)}>+</button></div></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div><div className="cart-bottom"><div><span>Subtotal</span><strong>{money(total)}</strong></div><p>Shipping calculated at checkout.</p><button className="dark-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}>Continue to checkout →</button><button className="plain-button" onClick={() => setCartOpen(false)}>Keep browsing</button></div></> : <div className="empty"><span>♡</span><h3>Your bag is waiting.</h3><p>Find your next everyday favourite.</p><button className="dark-button" onClick={() => { setCartOpen(false); document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }) }}>Shop the collection</button></div>}
    </aside></div>}
    {checkoutOpen && <div className="overlay" onClick={() => setCheckoutOpen(false)}><section className="checkout" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setCheckoutOpen(false)}>×</button><p className="eyebrow">ONE LAST STEP</p><h2>Checkout</h2><div className="total-row"><span>Demo order total</span><strong>{money(total)}</strong></div><form onSubmit={checkout}><label>Full name<input required value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} /></label><label>Email address<input type="email" required value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} /></label><label>Delivery address<textarea rows="3" required value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} /></label><button className="dark-button" disabled={busy}>{busy ? 'Submitting…' : 'Place demo order'}</button><small>This portfolio demo does not charge your card or process real payments.</small></form></section></div>}
  </div>
}
