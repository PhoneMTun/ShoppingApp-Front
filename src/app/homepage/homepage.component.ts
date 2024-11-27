import { Component, OnInit } from '@angular/core';
import { OrderService } from '../homepage/services/services.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  orders: any[] = []; // All orders
  paginatedOrders: any[] = []; // Orders for the current page
  errorMessage: string | null = null; // For storing error messages
  isCartVisible: boolean = false;
  userId: number = 0;
  username: string = '';
  role: string = ''; 

  mostProfitableProduct: any = null;
  popularProducts: any[] = [];

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  paginationArray: number[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = parseInt(user.id, 10); // Extract user ID
        this.username = user.username; // Extract username
        this.role = user.role; // Extract role
        this.fetchOrders();
        if (this.role === 'ADMIN') {
          this.fetchMostProfitableProduct();
          this.fetchPopularProducts();
        }
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    } else {
      console.error('No user data found in local storage!');
    }
  }

  fetchOrders(): void {
    this.orderService.getAllOrdersByUser(this.userId).subscribe(
      (response) => {
        if (response.success) {
          this.orders = response.data;
          this.setupPagination(); // Initialize pagination
        } else {
          console.error('Failed to fetch orders:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching orders:', error);
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
        console.log('Order canceled successfully:', response);
        this.fetchOrders(); // Refresh the order list
      },
      (error) => {
        this.errorMessage = error.error?.message || 'An unexpected error occurred.';
      }
    );
  }

  completeOrder(orderId: number): void {
    this.orderService.completeOrder(orderId).subscribe(
      (response) => {
        console.log('Order completed successfully:', response);
        this.fetchOrders(); // Refresh the order list
      },
      (error) => {
        this.errorMessage = error.error?.message || 'An unexpected error occurred.';
      }
    );
  }

  closeErrorMessage(): void {
    this.errorMessage = null; // Clear the error message
  }

  calculateTotalAmount(orderItems: any[]): number {
    return orderItems.reduce((total, item) => total + item.priceAtPurchase * item.quantity, 0);
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  fetchMostProfitableProduct(): void {
    this.orderService.getMostProfitableProduct().subscribe(
      (response) => {
        this.mostProfitableProduct = response.data[0];
      },
      (error) => {
        console.error('Error fetching most profitable product:', error);
      }
    );
  }

  fetchPopularProducts(): void {
    this.orderService.getPopularProducts().subscribe(
      (response) => {
        this.popularProducts = response.data;
      },
      (error) => {
        console.error('Error fetching popular products:', error);
      }
    );
  }
}
