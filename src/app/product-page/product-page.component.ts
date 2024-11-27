import { Component, OnInit } from '@angular/core';
import { ProductPageService } from './service/service.service';
import { Router } from '@angular/router';
import { CartService } from '../shared/service/service.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
  products: any[] = []; // All products
  paginatedProducts: any[] = []; // Products for the current page
  errorMessage: string | null = null;
  isCartVisible = false;
  role = '';
  userId: number = 0;
  username: string = '';
  isAddProductModalOpen = false;
  isEditMode = false;
  selectedProduct: any = null;

  // Pagination-related variables
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  paginationArray: number[] = [];

  constructor(
    private productService: ProductPageService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.loadProducts();
  }

  initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = parseInt(user.id, 10);
        this.role = user.role;
        this.username = user.username;
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    } else {
      console.error('No user data found in local storage!');
    }
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (response) => {
        this.products = response.data;
        this.setupPagination(); // Initialize pagination
      },
      (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products.';
      }
    );
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    this.paginationArray = Array.from({ length: this.totalPages }, (_, i) => i + 1); // Create an array [1, 2, ..., totalPages]
    this.updatePaginatedProducts();
  }
  

  updatePaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  openAddProductModal(): void {
    this.isAddProductModalOpen = true;
    this.isEditMode = false;
    this.selectedProduct = null;
  }

  openEditProductModal(product: any): void {
    this.selectedProduct = product;
    this.isAddProductModalOpen = true;
  }

  closeAddProductModal(): void {
    this.isAddProductModalOpen = false;
    this.errorMessage = null;
    this.selectedProduct = null;
  }

  // addToCart(product: any): void {
  //   try {
  //     const cartProduct = { ...product, quantity: 1 }; // Clone the product object and add a default quantity
  //     this.cartService.addItemToCart(cartProduct); // Add the cloned product to the cart
  //     console.log(`Added to cart: ${product.description}`);
  //   } catch (error) {
  //     console.error('Error adding product to cart:', error);
  //     this.errorMessage = 'Failed to add product to cart.';
  //   }
  // }
  addToCart(product: any): void {
    this.cartService.addItemToCart(product); // Notify CartService
    console.log(`Added to cart: ${product.description}`);
  }
  

  addToWatchlist(productId: number): void {
    if (!this.userId) {
      console.error('User is not logged in. Cannot add to watchlist.');
      this.errorMessage = 'You must be logged in to add items to the watchlist.';
      return;
    }
  
    this.productService.addToWatchlist(productId, this.userId).subscribe(
      () => {
        console.log(
          `Product ID ${productId} added to watchlist for User ID ${this.userId}`
        );
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error adding to watchlist:', error);
        this.errorMessage =
          error.error?.message || 'Failed to add product to watchlist.';
      }
    );
  }
  

  closeErrorMessage(): void {
    this.errorMessage = null;
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  editProduct(productId: number): void {
    this.router.navigate(['/edit-product', productId]);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

}
