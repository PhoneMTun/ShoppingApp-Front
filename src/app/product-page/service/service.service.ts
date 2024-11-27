import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductPageService {
  private baseProductUrl = 'http://localhost:8080/products';
  private watchlistUrl = 'http://localhost:8080/watchlist';
  private cartKey = 'shoppingCart';

  private cartItemsSubject = new BehaviorSubject<any[]>(this.getCartItems());
  cartItems$ = this.cartItemsSubject.asObservable();

  private watchlistItemsSubject = new BehaviorSubject<any[]>([]);
  watchlistItems$ = this.watchlistItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch all products
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.baseProductUrl}/all`);
  }

  // Fetch watchlist for a user
  // service.service.ts
  fetchWatchlist(userId: number): void {
    this.http.get(`${this.watchlistUrl}/products/all?userId=${userId}`).subscribe({
      next: (response: any) => {
        const watchlist = Array.isArray(response) ? response : response.data || [];
        this.watchlistItemsSubject.next(watchlist); // Emit updated watchlist
      },
      error: (err) => {
        console.error('Error fetching watchlist:', err);
        this.watchlistItemsSubject.next([]); // Emit empty list on error
      },
    });
  }
  private updateWatchlistItems(userId: number): void {
    this.fetchWatchlist(userId);
  }


  addToWatchlist(productId: number, userId: number): Observable<any> {
    return this.http.post(`${this.watchlistUrl}/product/${productId}?userId=${userId}`, {}).pipe(
      tap(() => this.updateWatchlistItems(userId)) // Refresh the watchlist
    );
  }
  
  removeFromWatchlist(productId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.watchlistUrl}/product/${productId}?userId=${userId}`).pipe(
      tap(() => this.updateWatchlistItems(userId)) // Refresh the watchlist
    );
  }
  

  // Clear the entire watchlist for a user
  clearWatchlist(userId: number): Observable<any> {
    return this.http.delete(`${this.watchlistUrl}/clear?userId=${userId}`);
  }

  // Add a product to the cart
  addToCart(product: any): void {
    let cart = this.getCartItems();
    const existingProduct = cart.find((item: any) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    this.updateCart(cart);
  }

  // Remove a product from the cart
  removeFromCart(productId: number): void {
    const updatedCart = this.getCartItems().filter((item) => item.id !== productId);
    this.updateCart(updatedCart);
  }

  // Update the quantity of a cart item
  updateCartItemQuantity(productId: number, quantity: number): void {
    let cart = this.getCartItems();
    const product = cart.find((item) => item.id === productId);
    if (product && quantity > 0) {
      product.quantity = quantity;
    } else if (product) {
      cart = cart.filter((item) => item.id !== productId); // Remove if quantity <= 0
    }
    this.updateCart(cart);
  }

  // Get all items in the cart
  getCartItems(): any[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  // Clear the entire cart
  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.cartItemsSubject.next([]);
  }

  // Update the cart and notify subscribers
  private updateCart(cart: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartItemsSubject.next(cart);
  }

  // Get watchlist updates
  getWatchlistUpdates(): Observable<any[]> {
    return this.watchlistItems$;
  }
  addProduct(product: any): Observable<any> {
    console.log('Sending product to backend:', product);
    return this.http.post('http://localhost:8080/admin/product', product).pipe(
      catchError((error) => {
        console.error('Error in addProduct:', error);
        return of(error); // Return an observable with the error
      })
    );
  }

  updateProduct(productId: number, productData: any) {
    return this.http.patch(`http://localhost:8080/admin/product/${productId}`, productData);
  }
  
  
}
