import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/service/service.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css'],
})
export class AddToCartComponent implements OnInit {
  @Input() isVisible: boolean = false; // Controls visibility of the cart
  cartItems: any[] = []; // Stores items in the cart
  userId: number = 0; // Stores the user ID from local storage

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve user data from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = parseInt(user.id, 10); // Extract user ID as a number
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    }

    // Subscribe to cart updates
    this.listenToCartUpdates();
  }

  // Listen to cart updates from CartService
  listenToCartUpdates(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items; // Update cart items
    });
  }

  // Compute subtotal dynamically
  get subtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.retailPrice * item.quantity,
      0
    );
  }

  // Remove an item from the cart
  removeFromCart(productId: number): void {
    this.cartService.removeItemFromCart(productId);
  }

  // Update the quantity of an item in the cart
  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateCartItemQuantity(productId, quantity);
    } else {
      this.removeFromCart(productId); // Remove item if quantity is set to 0
    }
  }

  // Determine the CSS class for cart animation
  getCartClasses(): string {
    return this.isVisible ? 'cart-slide-in' : 'cart-slide-out';
  }

  // Navigate to the confirmation page
  orderNow(): void {
    const orderPayload = {
      userId: this.userId,
      items: this.cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    this.router.navigate(['/confirmation'], {
      state: { cartItems: this.cartItems, userId: this.userId },
    });
  }
}
