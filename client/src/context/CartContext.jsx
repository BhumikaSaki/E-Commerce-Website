import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exist = state.cartItems.find((x) => x._id === action.payload._id);
      if (exist) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x._id === action.payload._id ? { ...x, qty: x.qty + 1 } : x
          ),
        };
      }
      return { ...state, cartItems: [...state.cartItems, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x._id !== action.payload),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        cartItems: state.cartItems.map((x) =>
          x._id === action.payload.id ? { ...x, qty: action.payload.qty } : x
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    case 'LOAD_CART':
      return { ...state, cartItems: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });

  useEffect(() => {
    const stored = localStorage.getItem('shopby_cart');
    if (stored) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(stored) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopby_cart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addToCart = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemsCount = state.cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        itemsCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
