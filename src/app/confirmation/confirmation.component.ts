import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from './service/service.service';
import { CartService } from '../shared/service/service.service'; // Import CartService

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  cartItems: any[] = [];
  userId: number = 0;
  isCartVisible: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.cartItems = state.cartItems || [];
    this.userId = state.userId || 0;

    if (!this.cartItems.length || !this.userId) {
      this.errorMessage = 'Invalid cart data. Redirecting to homepage...';
      console.error(this.errorMessage);
      setTimeout(() => this.router.navigate(['/homepage']), 3000);
    }
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  // Getter for subtotal
  get subtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.retailPrice * item.quantity,
      0
    );
  }

  confirmOrder(): void {
    const orderPayload = {
      userId: this.userId,
      items: this.cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    this.confirmationService.placeOrder(orderPayload).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        console.error('Error placing order:', err);
        this.errorMessage =
          err.error?.message || 'Failed to place the order. Please try again.';
      },
    });
  }

  closeErrorMessage(): void {
    this.errorMessage = null;
  }
}
