import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {OrderService} from '../services/services.service';

@Component({
  selector: 'app-top-items',
  templateUrl: './top-items.component.html',
  styleUrls: ['./top-items.component.css']
})
export class TopItemsComponent implements OnInit {
  topFrequentlyPurchased: any[] = [];
  topRecentlyPurchased: any[] = [];
  activeFrequentIndex = 0; // Active slide index for frequent items
  activeRecentIndex = 0; // Active slide index for recent items
  userId: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = parseInt(user.id, 10);
        this.fetchTopFrequentlyPurchased();
        this.fetchTopRecentlyPurchased();
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    } else {
      console.error('No user data found in local storage!');
    }
  }

  fetchTopFrequentlyPurchased(): void {
    this.http
      .get<any>(`http://localhost:8080/products/frequent/3?userId=${this.userId}`)
      .subscribe({
        next: (response) => {
          this.topFrequentlyPurchased = response.data;
        },
        error: (error) => {
          console.error('Error fetching frequently purchased items:', error);
        }
      });
  }

  fetchTopRecentlyPurchased(): void {
    this.http
      .get<any>(`http://localhost:8080/products/recent/3?userId=${this.userId}`)
      .subscribe({
        next: (response) => {
          this.topRecentlyPurchased = response.data;
        },
        error: (error) => {
          console.error('Error fetching recently purchased items:', error);
        }
      });
  }

  nextFrequentSlide(): void {
    this.activeFrequentIndex =
      (this.activeFrequentIndex + 1) % this.topFrequentlyPurchased.length;
  }

  prevFrequentSlide(): void {
    this.activeFrequentIndex =
      (this.activeFrequentIndex - 1 + this.topFrequentlyPurchased.length) %
      this.topFrequentlyPurchased.length;
  }

  nextRecentSlide(): void {
    this.activeRecentIndex =
      (this.activeRecentIndex + 1) % this.topRecentlyPurchased.length;
  }

  prevRecentSlide(): void {
    this.activeRecentIndex =
      (this.activeRecentIndex - 1 + this.topRecentlyPurchased.length) %
      this.topRecentlyPurchased.length;
  }
}
