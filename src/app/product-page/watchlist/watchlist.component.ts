import { Component, OnInit } from '@angular/core';
import { ProductPageService } from '../service/service.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlistItems: any[] = [];
  userId: number = 0;
  errorMessage: string | null = null;

  constructor(private productService: ProductPageService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = parseInt(user.id, 10);
        this.subscribeToWatchlist();
        this.fetchWatchlist();
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
        this.errorMessage = 'Unable to retrieve user data.';
      }
    } else {
      console.error('No user data found in local storage!');
      this.errorMessage = 'User not logged in.';
    }
  }

  subscribeToWatchlist(): void {
    this.productService.getWatchlistUpdates().subscribe({
      next: (items) => {
        this.watchlistItems = items;
        console.log('Watchlist updated dynamically:', this.watchlistItems); // Debug log
      },
      error: (err) => {
        console.error('Error subscribing to watchlist updates:', err);
      },
    });
  }

  fetchWatchlist(): void {
    this.productService.fetchWatchlist(this.userId);
  }

  removeFromWatchlist(productId: number): void {
    this.productService.removeFromWatchlist(productId, this.userId).subscribe({
      next: () => {
        console.log(`Product ID ${productId} removed from watchlist.`);
      },
      error: (err) => {
        console.error('Error removing from watchlist:', err);
        this.errorMessage = 'Failed to remove item from the watchlist.';
      },
    });
  }
}
