import { createContext, useContext, useMemo, useState } from 'react'

export const PRODUCTS = [
  { id:'aloe-gel', name:'Pure Aloe Ferox Gel', size:'150ml', price:149, category:'Skincare', badge:'Best Seller', description:'Cooling, lightweight daily hydration for sun-stressed and dry skin.', image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80' },
  { id:'bitter-tea', name:'Aloe Bitter Detox Tea', size:'20 Bags', price:69, category:'Wellness & Teas', description:'A traditional Aloe Ferox bitter infusion for a mindful wellness ritual.', image:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80' },
  { id:'repair-cream', name:'Ferox Intensive Skin Repair Cream', size:'100ml', price:189, category:'Skincare', description:'Rich daily care for dry, weathered and damaged-looking skin.', image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80' },
  { id:'glow-bundle', name:'Ultimate Klein Karoo Glow Bundle', size:'3-piece set', price:349, compareAt:407, category:'Bundles', badge:'Save R58', description:'Gel + Bitter Tea + Repair Cream — the complete Cape Aloe ritual.', image:'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80' },
]

const CartContext = createContext(null)
export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const addItem = (product) => setItems(prev => { const found=prev.find(i=>i.id===product.id); return found ? prev.map(i=>i.id===product.id?{...i,quantity:i.quantity+1}:i) : [...prev,{...product,quantity:1}] })
  const removeItem = id => setItems(prev=>prev.filter(i=>i.id!==id))
  const increment = id => setItems(prev=>prev.map(i=>i.id===id?{...i,quantity:i.quantity+1}:i))
  const decrement = id => setItems(prev=>prev.flatMap(i=>i.id===id ? (i.quantity>1?[{...i,quantity:i.quantity-1}]:[]) : [i]))
  const subtotal = useMemo(()=>items.reduce((sum,i)=>sum+i.price*i.quantity,0),[items])
  const itemCount = useMemo(()=>items.reduce((sum,i)=>sum+i.quantity,0),[items])
  const amountUntilFreeShipping = Math.max(0,500-subtotal)
  return <CartContext.Provider value={{items,addItem,removeItem,increment,decrement,subtotal,itemCount,amountUntilFreeShipping,isOpen,setIsOpen,shippingThreshold:500}}>{children}</CartContext.Provider>
}
export const useCart = () => useContext(CartContext)
