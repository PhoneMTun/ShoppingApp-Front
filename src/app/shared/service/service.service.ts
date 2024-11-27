import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  private cartItemsSubject = new BehaviorSubject<any[]>([]);

  cartItemCount$ = this.cartItemCount.asObservable();
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  // Load cart from local storage on initialization
  private loadCartFromLocalStorage(): void {
    const savedCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    this.cartItems = savedCart;
    this.updateCartState();
  }

  // Save cart to local storage
  private saveCartToLocalStorage(): void {
    localStorage.setItem('shoppingCart', JSON.stringify(this.cartItems));
  }

  // Update cart state and notify subscribers
  private updateCartState(): void {
    this.cartItemCount.next(this.cartItems.reduce((total, item) => total + item.quantity, 0));
    this.cartItemsSubject.next(this.cartItems);
  }

  // Add a product to the cart
  addItemToCart(item: any): void {
    const existingProductIndex = this.cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingProductIndex > -1) {
      // Increment quantity for existing product
      this.cartItems[existingProductIndex].quantity += item.quantity || 1;
    } else {
      // Add new product
      this.cartItems.push({ ...item, quantity: 1 });
    }

    this.saveCartToLocalStorage();
    this.updateCartState();
  }

  // Get all cart items
  getCartItems(): any[] {
    return this.cartItems;
  }

  // Remove a product from the cart
  removeItemFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
    this.saveCartToLocalStorage();
    this.updateCartState();
  }

  // Update the quantity of a cart item
  updateCartItemQuantity(productId: number, quantity: number): void {
    const product = this.cartItems.find((item) => item.id === productId);
    if (product) {
      if (quantity > 0) {
        product.quantity = quantity;
      } else {
        this.removeItemFromCart(productId); // Remove product if quantity is 0
      }
      this.saveCartToLocalStorage();
      this.updateCartState();
    }
  }

  // Add to cart wrapper for product-specific logic
  addToCart(product: any): void {
    this.addItemToCart(product);
  }

  // Remove from cart wrapper
  removeFromCart(productId: number): void {
    this.removeItemFromCart(productId);
  }

  // Update quantity wrapper
  updateQuantity(productId: number, quantity: number): void {
    this.updateCartItemQuantity(productId, quantity);
  }
  clearCart(): void {
    this.cartItems = []; 
    localStorage.removeItem('shoppingCart'); 
    this.updateCartState(); 
  }
  
}
