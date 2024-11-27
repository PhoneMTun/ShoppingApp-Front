import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductPageService } from '../service/service.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() productData: any | null = null; // Input to receive product data for editing
  @Output() formClosed = new EventEmitter<void>();
  @Output() refreshProducts = new EventEmitter<void>();
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductPageService) {
    this.productForm = this.fb.group({
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/.*$/)]],
      wholesalePrice: [0, [Validators.required, Validators.min(0.01)]],
      retailPrice: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productData'] && this.productData) {
      this.productForm.patchValue(this.productData); // Populate the form with product data
    }
  }

  submitForm(): void {
    if (this.productForm.valid) {
      const productId = this.productData?.id;
      const productServiceMethod = productId
        ? this.productService.updateProduct(productId, this.productForm.value)
        : this.productService.addProduct(this.productForm.value);

      productServiceMethod.subscribe({
        next: () => {
          alert(productId ? 'Product updated successfully!' : 'Product added successfully!');
          this.refreshProducts.emit();
          this.close();
        },
        error: (err) => {
          if (err.error && err.error.data) {
            this.mapValidationErrors(err.error.data);
          }
        },
      });
    }
  }

  mapValidationErrors(errors: string[]): void {
    errors.forEach((error) => {
      const [fieldName, errorMessage] = error.split(':').map((str) => str.trim());
      if (fieldName && this.productForm.controls[fieldName]) {
        this.productForm.controls[fieldName].setErrors({
          backendError: errorMessage,
        });
      }
    });
  }

  close(): void {
    this.productForm.reset();
    this.formClosed.emit();
  }
}
