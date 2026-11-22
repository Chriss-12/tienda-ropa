import { useEffect, useState, type CSSProperties } from 'react'
import './App.css'

type Category = 'Todo' | 'Niños' | 'Bebés' | 'Accesorios'
type Product = {
  id: number
  name: string
  kind: string
  description: string
  price: number
  category: Exclude<Category, 'Todo'>
  image: string
  alt: string
  stock: number
  tone: string
}
type CartLine = { product: Product; quantity: number }

const products: Product[] = [
  { id: 1, name: 'Camiseta Buen Día', kind: 'Prenda infantil', description: 'Para ir al parque o salir de paseo. Combina fácil con shorts, jeans y lo que ya tiene en el clóset.', price: 95, category: 'Niños', image: 'https://thegreencrib.com/cdn/shop/files/KiteHelloEarthTshirt.jpg?v=1708196574&width=1000', alt: 'Niños con camisetas claras en un jardín', stock: 8, tone: 'mint' },
  { id: 2, name: 'Vestido Campo', kind: 'Prenda infantil', description: 'Amarillo, con estampado de naturaleza y bolsillos para esos pequeños tesoros que aparecen en el camino.', price: 145, category: 'Niños', image: 'https://www.pinklay.com/cdn/shop/files/RVP_8215.jpg?v=1731920355', alt: 'Vestido infantil amarillo con estampado de naturaleza', stock: 5, tone: 'peach' },
  { id: 3, name: 'Conjunto Raíces', kind: 'Conjunto unisex', description: 'Un conjunto verde para salir cuando refresca. Cómodo y fácil de combinar con las prendas de todos los días.', price: 185, category: 'Bebés', image: 'https://earthlingsunited.com.au/cdn/shop/files/earthlings-united-kids-sweater-jumper-organic-cotton14.jpg?v=1771542184&width=1000', alt: 'Niños con conjuntos verdes de algodón', stock: 4, tone: 'sage' },
  { id: 4, name: 'Ropa de aventura', kind: 'Prenda infantil', description: 'Arena en los zapatos y ganas de seguir. Una opción cómoda para el parque, la playa o el lugar que toque explorar.', price: 130, category: 'Niños', image: 'https://1986433023.rsc.cdn77.org/temp/1680169086_3f6166ef375231b5638f2d0143aef47c.jpg', alt: 'Dos pequeños exploran la playa con ropa cómoda', stock: 7, tone: 'blue' },
  { id: 5, name: 'Jardín en calma', kind: 'Prenda infantil', description: 'Tonos menta y azul, con estampados suaves. Para una vuelta por el barrio o una tarde tranquila en el jardín.', price: 155, category: 'Niños', image: 'https://klodsy.com/images/blog/en/sustainable-childrens-fashion.webp', alt: 'Dos niños con ropa de tonos suaves en un jardín rodeado de plantas', stock: 3, tone: 'cream' },
  { id: 6, name: 'Pequeño explorador', kind: 'Prenda para bebé', description: 'Una camiseta verde menta con un limón que llama la atención. El detalle justo para salir de lo de siempre.', price: 115, category: 'Bebés', image: 'https://milimilu.com/cdn/shop/files/Family_matching_lemon_T-shirts.jpg?v=1779505369&width=1000', alt: 'Niño con camiseta verde menta y estampado de limón', stock: 6, tone: 'yellow' },
]

const categories: Category[] = ['Todo', 'Niños', 'Bebés', 'Accesorios']

function LeafMark() {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none"><path d="M26.4 5.6C14.6 5.9 7.3 9.8 7.3 17.5c0 4.8 3.4 8.2 8 8.2 8.2 0 11-9.9 11.1-20.1Z" stroke="currentColor" strokeWidth="1.8" /><path d="M5.8 27.4c4.8-7 9.4-11.2 16.5-15.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}

function CartIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.1 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L21 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.5" cy="20" r="1" fill="currentColor"/><circle cx="18" cy="20" r="1" fill="currentColor"/></svg>
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todo')
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailQuantity, setDetailQuantity] = useState(1)
  const [remainingStock, setRemainingStock] = useState<Record<number, number>>(() => Object.fromEntries(products.map((product) => [product.id, product.stock])))
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [activeCategory])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  useEffect(() => {
    if (!selectedProduct && !cartOpen) return
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedProduct(null)
        setCartOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedProduct, cartOpen])

  const visibleProducts = products.filter((product) => activeCategory === 'Todo' || product.category === activeCategory)
  const cartUnits = cart.reduce((sum, line) => sum + line.quantity, 0)

  function openDetails(product: Product) {
    setSelectedProduct(product)
    setDetailQuantity(1)
  }

  function addToCart(product: Product, quantity = 1) {
    const available = remainingStock[product.id] ?? 0
    const amount = Math.min(quantity, available)
    if (amount < 1) {
      setNotice('Ya no quedan unidades disponibles de esta prenda')
      return
    }
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id)
      return existing
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + amount } : line)
        : [...current, { product, quantity: amount }]
    })
    setRemainingStock((current) => ({ ...current, [product.id]: current[product.id] - amount }))
    setSelectedProduct(null)
    setNotice(`${amount} ${amount === 1 ? 'unidad añadida' : 'unidades añadidas'} al carrito`)
  }

  function removeFromCart(productId: number) {
    const line = cart.find((item) => item.product.id === productId)
    if (!line) return
    setCart((current) => current.filter((item) => item.product.id !== productId))
    setRemainingStock((current) => ({ ...current, [productId]: current[productId] + line.quantity }))
  }

  function adjustCartQuantity(productId: number, change: -1 | 1) {
    const line = cart.find((item) => item.product.id === productId)
    if (!line || (change === 1 && remainingStock[productId] < 1)) return
    if (change === -1 && line.quantity === 1) {
      removeFromCart(productId)
      return
    }
    setCart((current) => current.map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + change } : item))
    setRemainingStock((current) => ({ ...current, [productId]: current[productId] - change }))
  }

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return <>
    <div className="announcement"><span>Ropa para jugar y moverse a su manera.</span><a href="#historia">Así es ARIBU <span aria-hidden="true">↗</span></a></div>
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="ARIBU, inicio"><span className="brand-mark"><LeafMark /></span><span className="brand-name">ARIBU</span><span className="brand-tagline">MODA ECOLÓGICA</span></a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">
        <a href="#coleccion" onClick={() => setMenuOpen(false)}>Colección</a><a href="#historia" onClick={() => setMenuOpen(false)}>Nuestra esencia</a><a href="#propuesta" onClick={() => setMenuOpen(false)}>La propuesta</a>
      </nav>
      <div className="header-actions">
        <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${cartUnits} productos`}><CartIcon /><span className="cart-label">Carrito</span><span className="cart-count">{cartUnits}</span></button>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
      </div>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> Moda ecológica para la infancia</p><h1>Que la ropa<br />siga el ritmo <em>del juego.</em></h1><p className="hero-description">Camisetas, vestidos y conjuntos para salir, correr y volver con una historia nueva.</p><div className="hero-actions"><a className="button button-dark" href="#coleccion">Ver las prendas <span aria-hidden="true">↘</span></a><a className="text-link" href="#historia">Nuestra historia <span aria-hidden="true">↗</span></a></div><div className="hero-note"><span className="note-mark"><LeafMark /></span> Hecha para jugar sin pausa</div></div>
        <div className="hero-visual"><div className="hero-image-wrap"><img className="hero-image" src="https://mai-clothing.com/cdn/shop/files/home_page_sustainability_jungle_iguana_print_a6eb48bb-aee9-4345-979b-91b3433fd49e_1200x.jpg?v=1687426374" alt="Niños con prendas estampadas en un entorno verde" fetchPriority="high" /><div className="image-caption"><span>Color para explorar</span><span>01 / 03</span></div></div><div className="hero-sticker"><LeafMark /><span>Vestir<br />con propósito</span></div><span className="hero-sun" aria-hidden="true" /></div>
        <a className="scroll-cue" href="#coleccion"><span /> Desliza para descubrir</a>
      </section>

      <section className="intro-strip" aria-label="Nuestra propuesta"><p>Ropa para jugar.</p><span className="intro-divider" aria-hidden="true">✳</span><p>Y repetir mañana.</p></section>

      <section className="collection section-wrap" id="coleccion">
        <div className="section-heading reveal"><div><p className="eyebrow"><span className="eyebrow-line" /> La colección</p><h2>Ropa para los días<br />que se pasan <em>jugando.</em></h2></div><p className="section-aside">Elige una prenda para ver cómo es, cuánto cuesta y cuántas quedan.</p></div>
        <div className="collection-toolbar reveal"><div className="filter-list" role="group" aria-label="Filtrar productos por categoría">{categories.map((category) => <button key={category} type="button" className={activeCategory === category ? 'filter-chip active' : 'filter-chip'} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><span className="results-count">{visibleProducts.length} piezas</span></div>
        <div className="product-grid" aria-live="polite">
          {visibleProducts.length ? visibleProducts.map((product, index) => <article className={`product-card reveal ${product.tone}`} key={product.id} style={{ '--delay': `${(index % 3) * 90}ms` } as CSSProperties}>
            <div className="product-photo"><button className="product-image-trigger" type="button" onClick={() => openDetails(product)} aria-label={`Ver detalles de ${product.name}`}><img src={product.image} alt={product.alt} loading="lazy" /></button><button className={favorites.includes(product.id) ? 'favorite is-favorite' : 'favorite'} type="button" onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`} aria-pressed={favorites.includes(product.id)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10A4.7 4.7 0 0 1 12 6.7a4.7 4.7 0 0 1 8.8 2.1Z" /></svg></button></div>
            <div className="product-meta"><div><p className="product-kind">{product.kind}</p><h3>{product.name}</h3></div><span className="product-price">Bs {product.price}</span></div>
            <div className="product-foot"><span className="stock-preview">{remainingStock[product.id] > 0 ? `${remainingStock[product.id]} disponibles` : 'Agotado'}</span><button type="button" className="add-button" onClick={() => addToCart(product)} disabled={remainingStock[product.id] === 0} aria-label={`Añadir ${product.name} a la bolsa`}>+</button></div>
          </article>) : <div className="empty-state"><LeafMark /><p>Estamos preparando nuevas piezas para esta categoría.</p></div>}
        </div>
        
      </section>

      <section className="story" id="historia"><div className="story-image reveal"><img src="https://cdn.shopify.com/s/files/1/0466/5835/5349/files/TT_SS22_151021_Chickens_20997_2_2048x2048.jpg?v=1709642565" alt="Dos niños comparten un momento al aire libre en un jardín" loading="lazy" /><div className="story-image-label">Crecer a su ritmo <span>✳</span></div></div><div className="story-copy reveal"><p className="eyebrow"><span className="eyebrow-line" /> Nuestra esencia</p><h2>Los días de juego<br />no siguen <em>un plan.</em></h2><p>El día empieza con ropa limpia. Después llegan el parque, las manchas y las historias. En ARIBU pensamos la ropa para acompañar todo eso.</p><a className="text-link" href="#propuesta">Conoce ARIBU <span aria-hidden="true">↗</span></a><div className="story-signature"><span className="signature-mark"><LeafMark /></span><span>Ropa para todos los días.<br />Y para lo que venga.</span></div></div></section>

      <section className="promise section-wrap reveal" id="propuesta"><div className="promise-symbol"><LeafMark /></div><p className="eyebrow">Elegir con un poco más de cuidado</p><h2>Cuidar lo que usamos<br />empieza por <em>elegir bien.</em></h2><p className="promise-copy">Una prenda puede acompañar muchos días. Y si alguien más la aprovecha después, mejor todavía.</p><a className="button button-light" href="#coleccion">Explorar prendas <span aria-hidden="true">↗</span></a><span className="promise-orbit orbit-one" aria-hidden="true" /><span className="promise-orbit orbit-two" aria-hidden="true" /></section>

      <section className="contact-band" id="tienda-final"><div><p className="eyebrow"><span className="eyebrow-line" /> El plan puede cambiar</p><h2>¿Qué toca hoy?<br /><em>Salir a jugar.</em></h2></div><a className="contact-link" href="#coleccion">Ver las prendas <span aria-hidden="true">↗</span></a></section>
    </main>

    <footer className="site-footer"><a className="brand footer-brand" href="#inicio"><span className="brand-mark"><LeafMark /></span><span className="brand-name">ARIBU</span><span className="brand-tagline">MODA ECOLÓGICA</span></a><p>Ropa ecológica para la infancia y sus días sin pausa.</p><span className="copyright">© 2026 ARIBU</span></footer>

    {selectedProduct && <div className="detail-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null) }}><section className="product-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" aria-describedby="detail-description"><button className="detail-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Cerrar detalles">×</button><div className="detail-photo"><img src={selectedProduct.image} alt={selectedProduct.alt} /><span className="detail-stock">{remainingStock[selectedProduct.id] > 0 ? `${remainingStock[selectedProduct.id]} unidades disponibles` : 'Agotado'}</span></div><div className="detail-copy"><p className="eyebrow"><span className="eyebrow-line" /> {selectedProduct.kind}</p><h2 id="detail-title">{selectedProduct.name}</h2><p className="detail-description" id="detail-description">{selectedProduct.description}</p><div className="detail-price">Bs {selectedProduct.price}</div><div className="unit-row"><div><strong>Unidades</strong><span>Elige cuántas quieres añadir</span></div><div className="quantity-control"><button type="button" onClick={() => setDetailQuantity((quantity) => Math.max(1, quantity - 1))} disabled={detailQuantity <= 1} aria-label="Quitar una unidad">−</button><output aria-live="polite">{detailQuantity}</output><button type="button" onClick={() => setDetailQuantity((quantity) => Math.min(remainingStock[selectedProduct.id], quantity + 1))} disabled={detailQuantity >= remainingStock[selectedProduct.id]} aria-label="Añadir una unidad">+</button></div></div><div className="detail-total"><span>Total</span><strong>Bs {selectedProduct.price * detailQuantity}</strong></div><button className="button button-dark detail-add" type="button" disabled={remainingStock[selectedProduct.id] === 0} onClick={() => addToCart(selectedProduct, detailQuantity)}>{remainingStock[selectedProduct.id] > 0 ? 'Añadir a la bolsa' : 'Sin unidades disponibles'} <span aria-hidden="true">↗</span></button></div></section></div>}

    {cartOpen && <div className="drawer-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="drawer-heading"><div><p className="cart-kicker">ARIBU · TU SELECCIÓN</p><h2 id="cart-title">Tu carrito <span>{cartUnits} {cartUnits === 1 ? 'producto' : 'productos'}</span></h2></div><button className="drawer-close" type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">×</button></div>
      {cart.length ? <><ul className="cart-items">{cart.map(({ product, quantity }) => <li className="cart-line" key={product.id}><img src={product.image} alt={product.alt} /><div className="cart-line-content"><div className="cart-line-top"><div><span className="cart-line-kind">{product.kind}</span><strong>{product.name}</strong></div><button className="remove-line" type="button" onClick={() => removeFromCart(product.id)} aria-label={`Quitar ${product.name} del carrito`}>×</button></div><div className="cart-line-bottom"><div className="cart-quantity" aria-label={`Cantidad de ${product.name}`}><button type="button" onClick={() => adjustCartQuantity(product.id, -1)} aria-label={`Quitar una unidad de ${product.name}`}>−</button><span aria-live="polite">{quantity}</span><button type="button" onClick={() => adjustCartQuantity(product.id, 1)} disabled={remainingStock[product.id] === 0} aria-label={`Añadir una unidad de ${product.name}`}>+</button></div><strong className="cart-line-price">Bs {product.price * quantity}</strong></div></div></li>)}</ul><div className="cart-summary"><div className="cart-total"><span>Subtotal</span><strong>Bs {cart.reduce((total, line) => total + line.product.price * line.quantity, 0)}</strong></div><p className="cart-disclaimer">El envío se coordina al confirmar tu pedido.</p><button type="button" className="button button-dark cart-continue" onClick={() => setCartOpen(false)}>Seguir mirando <span aria-hidden="true">→</span></button></div></> : <div className="cart-empty"><div className="cart-empty-icon"><CartIcon /></div><h3>Tu carrito está esperando.</h3><p>Cuando encuentres algo que te guste, aquí podrás revisar tus prendas y cantidades.</p><button type="button" className="button button-dark" onClick={() => setCartOpen(false)}>Explorar prendas <span aria-hidden="true">→</span></button></div>}</aside></div>}
    <div className={notice ? 'toast is-visible' : 'toast'} role="status" aria-live="polite">{notice}</div>
  </>
}

export default App





