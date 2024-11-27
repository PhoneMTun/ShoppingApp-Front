import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../service/service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Output() cartToggle = new EventEmitter<void>();
  role: string = '';
  cartItemCount: number = 0;
  navLinks: { label: string; path: string; icon: string }[] = [
    { label: 'Home', path: '/homepage', icon: 'home' },
    { label: 'Cart', path: '/cart', icon: 'shopping_cart' },
    { label: 'Products', path: '/products', icon: 'inventory' },
    { label: 'Orders', path: '/orders', icon: 'receipt' },
  ];
  filteredNavLinks: { label: string; path: string; icon: string }[] = [];

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.initializeUser();
    this.filterNavLinks();
    this.listenToCartChanges(); // Subscribe to cart updates
  }

  initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.role = user.role;
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    } else {
      console.error('No user data found in local storage!');
    }
  }

  filterNavLinks(): void {
    this.filteredNavLinks =
      this.role === 'USER'
        ? this.navLinks.filter((link) => link.label !== 'Orders')
        : this.navLinks;
  }

  listenToCartChanges(): void {
    this.cartService.cartItemCount$.subscribe((count) => {
      this.cartItemCount = count; // Automatically update cart count
    });
  }

  openCart(): void {
    this.cartToggle.emit();
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('shoppingCart');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
