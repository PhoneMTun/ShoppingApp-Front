import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './service/service.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  product: any;
  errorMessage: string | null = null;
  isCartVisible: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(+productId).subscribe({
        next: (response) => {
          console.log('Product data retrieved:', response);
          this.product = response.data; // Adjusted to extract the nested `data` field
        },
        error: (err) => {
          console.error('Error retrieving product data:', err);
          this.errorMessage = 'Error retrieving product details.';
        }
      });
    } else {
      console.warn('Invalid product ID received.');
      this.errorMessage = 'Invalid product ID.';
    }
  }
  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
    console.log('Cart visibility toggled:', this.isCartVisible); // Debug log
  }
}
