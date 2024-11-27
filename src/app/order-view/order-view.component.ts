import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './services/services.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css'],
})
export class OrderViewComponent implements OnInit {
  order: any = null; // To store order details
  errorMessage: string | null = null;
  isCartVisible: boolean = false;
  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrder();
  }
  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
    console.log('Cart visibility toggled:', this.isCartVisible); // Debug log
  }

  fetchOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(+orderId).subscribe(
        (response) => {
          if (response.success) {
            this.order = response.data;
          } else {
            this.errorMessage = response.message;
          }
        },
        (error) => {
          this.errorMessage = 'Failed to fetch order details.';
        }
      );
    } else {
      this.errorMessage = 'Invalid order ID.';
    }
  }

  cancelOrder(): void {
    if (this.order) {
      this.orderService.cancelOrder(this.order.id).subscribe(
        (response) => {
          console.log('Order canceled successfully:', response);
          this.order.status = 'CANCELED'; // Update the status locally
        },
        (error) => {
          this.errorMessage = error.error?.message || 'Failed to cancel order.';
        }
      );
    }
  }

  calculateTotalAmount(): number {
    return this.order.orderItems.reduce(
      (total: number, item: any) => total + item.priceAtPurchase * item.quantity,
      0
    );
  }
}
