const PRODUCTS = {
  'aloe-gel': { name: 'Pure Aloe Ferox Gel', price: 149 },
  'bitter-tea': { name: 'Aloe Bitter Herbal Tea', price: 69 },
  'repair-cream': { name: 'Ferox Intensive Skin Repair Cream', price: 189 },
  'glow-bundle': { name: 'Ultimate Klein Karoo Glow Bundle', price: 349 },
}

const SHIPPING_THRESHOLD = 500
const SHIPPING_FEE = 60

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(body))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const secretKey = process.env.YOCO_SECRET_KEY
  if (!secretKey) return json(res, 503, { error: 'Payments are not configured yet.' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const incomingItems = Array.isArray(body?.items) ? body.items : []
    if (!incomingItems.length) return json(res, 400, { error: 'Your basket is empty.' })

    const items = incomingItems.map((item) => {
      const product = PRODUCTS[item.id]
      const quantity = Number(item.quantity)
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        throw new Error('Invalid basket item.')
      }
      return { ...product, id: item.id, quantity }
    })

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
    const total = subtotal + shipping
    if (total < 2) return json(res, 400, { error: 'Minimum payment amount is R2.' })

    const origin = process.env.APP_BASE_URL || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`
    const baseUrl = origin.replace(/\/$/, '')
    const payload = {
      amount: Math.round(total * 100),
      currency: 'ZAR',
      successUrl: `${baseUrl}/?checkout=success`,
      cancelUrl: `${baseUrl}/?checkout=cancelled`,
      failureUrl: `${baseUrl}/?checkout=failed`,
      lineItems: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        amount: Math.round(item.price * 100),
        currency: 'ZAR',
      })),
      metadata: { source: 'cape-aloe-co' },
    }

    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      console.error('Yoco checkout creation failed', response.status, data)
      return json(res, 502, { error: 'Unable to start payment with Yoco.' })
    }
    if (!data.redirectUrl) return json(res, 502, { error: 'Yoco did not return a payment URL.' })

    return json(res, 200, { redirectUrl: data.redirectUrl, checkoutId: data.id || null })
  } catch (error) {
    console.error('Checkout validation failed', error)
    return json(res, 400, { error: error.message || 'Unable to create checkout.' })
  }
}
