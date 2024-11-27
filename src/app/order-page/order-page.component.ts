import { Component, OnInit } from '@angular/core';
import { OrderPageService } from './service/service.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
})
export class OrderPageComponent implements OnInit {
  orders: any[] = []; // All orders
  paginatedOrders: any[] = []; // Orders for the current page
  errorMessage: string | null = null;
  userId: number = 0;
  role: string = '';
  isCartVisible: boolean = false;

  // Pagination-related variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginationArray: number[] = [];

  constructor(private orderService: OrderPageService) {}

  ngOnInit(): void {
    this.initializeUser();
    this.fetchOrders();
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = parseInt(user.id, 10);
        this.role = user.role;
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    } else {
      console.error('No user data found in local storage!');
    }
  }

  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (response) => {
        if (response.success) {
          this.orders = response.data;
          this.setupPagination(); // Initialize pagination
        } else {
          this.errorMessage = 'Failed to fetch orders.';
        }
      },
      (error) => {
        this.errorMessage = error.error?.message || 'An unexpected error occurred.';
      }
    );
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    this.paginationArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedOrders();
  }

  updatePaginatedOrders(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOrders();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrders();
    }
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe(
      (response) => {
        this.fetchOrders();
      },
      (error) => {
        this.errorMessage = error.error?.message || 'An unexpected error occurred.';
      }
    );
  }

  completeOrder(orderId: number): void {
    this.orderService.completeOrder(orderId).subscribe(
      (response) => {
        this.fetchOrders();
      },
      (error) => {
        this.errorMessage = error.error?.message || 'An unexpected error occurred.';
      }
    );
  }

  calculateTotalAmount(orderItems: any[]): number {
    return orderItems.reduce((total, item) => total + item.priceAtPurchase * item.quantity, 0);
  }

  closeErrorMessage(): void {
    this.errorMessage = null;
  }
}
