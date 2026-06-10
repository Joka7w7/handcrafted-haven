// ─────────────────────────────────────────────────────
// FILE 1: src/context/CartContext.tsx
// Global cart state using React context + localStorage
// ─────────────────────────────────────────────────────
 
"use client";
 
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
 
export interface CartItem {
  id:       string;
  name:     string;
  seller:   string;
  price:    number;
  emoji:    string;
  bg:       string;
  quantity: number;
}
 
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
 
type CartAction =
  | { type: "ADD_ITEM";      payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM";   payload: string }
  | { type: "UPDATE_QTY";    payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "LOAD";          payload: CartItem[] };
 
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return { ...state, items: action.payload };
 
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { ...action.payload, quantity: 1 }];
      return { ...state, items, isOpen: true };
    }
 
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
 
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: action.payload.quantity }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
 
    case "CLEAR_CART":
      return { ...state, items: [] };
 
    case "TOGGLE_DRAWER":
      return { ...state, isOpen: !state.isOpen };
 
    case "OPEN_DRAWER":
      return { ...state, isOpen: true };
 
    case "CLOSE_DRAWER":
      return { ...state, isOpen: false };
 
    default:
      return state;
  }
}
 
interface CartContextValue {
  items:       CartItem[];
  isOpen:      boolean;
  itemCount:   number;
  subtotal:    number;
  addItem:     (item: Omit<CartItem, "quantity">) => void;
  removeItem:  (id: string) => void;
  updateQty:   (id: string, quantity: number) => void;
  clearCart:   () => void;
  openCart:    () => void;
  closeCart:   () => void;
  toggleCart:  () => void;
}
 
const CartContext = createContext<CartContextValue | null>(null);
 
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
 
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hh-cart");
      if (saved) dispatch({ type: "LOAD", payload: JSON.parse(saved) });
    } catch {}
  }, []);
 
  useEffect(() => {
    try {
      localStorage.setItem("hh-cart", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);
 
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
 
  return (
    <CartContext.Provider
      value={{
        items:      state.items,
        isOpen:     state.isOpen,
        itemCount,
        subtotal,
        addItem:    (item) => dispatch({ type: "ADD_ITEM",    payload: item }),
        removeItem: (id)   => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQty:  (id, quantity) => dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
        clearCart:  ()     => dispatch({ type: "CLEAR_CART" }),
        openCart:   ()     => dispatch({ type: "OPEN_DRAWER" }),
        closeCart:  ()     => dispatch({ type: "CLOSE_DRAWER" }),
        toggleCart: ()     => dispatch({ type: "TOGGLE_DRAWER" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
 
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}