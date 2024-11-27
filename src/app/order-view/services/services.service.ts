import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${orderId}/cancel`, {});
  }
}
