import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  vendor: string
  maxQuantity: number
  category: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      const quantity = action.payload.quantity || 1
      
      let newItems: CartItem[]
      
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, existingItem.maxQuantity)
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      } else {
        const newItem: CartItem = {
          ...action.payload,
          quantity: Math.min(quantity, action.payload.maxQuantity)
        }
        newItems = [...state.items, newItem]
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }
      
      const newItems = state.items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      }
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }
    
    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload
      }
    
    case 'LOAD_CART':
      const total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        ...state,
        items: action.payload,
        total,
        itemCount
      }
    
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (open: boolean) => void
  getItemQuantity: (id: string) => number
  isInCart: (id: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('zavolah-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zavolah-cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const setCartOpen = (open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open })
  }

  const getItemQuantity = (id: string): number => {
    const item = state.items.find(item => item.id === id)
    return item ? item.quantity : 0
  }

  const isInCart = (id: string): boolean => {
    return state.items.some(item => item.id === id)
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getItemQuantity,
    isInCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
