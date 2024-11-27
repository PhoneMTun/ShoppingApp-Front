import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/services.service';

@Component({
  selector: 'app-total-sold-items',
  templateUrl: './total-sold-items.component.html',
  styleUrls: ['./total-sold-items.component.css'],
})
export class TotalSoldItemsComponent implements OnInit {
  totalSoldItems: number = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchTotalSoldItems();
  }

  fetchTotalSoldItems(): void {
    this.orderService.getAllOrders().subscribe(
      (response) => {
        if (response.success) {
          const orders = response.data.filter((order: any) => order.status === 'COMPLETED');
          this.totalSoldItems = orders.reduce((total: number, order: any) => {
            return total + order.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
          }, 0);
        } else {
          console.error('Failed to fetch orders:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }
}
