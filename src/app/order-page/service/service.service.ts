import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderPageService {
  private baseUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${orderId}/cancel`, {});
  }

  completeOrder(orderId: number): Observable<any> {
    return this.http.patch<any>(`http://localhost:8080/admin/orders/${orderId}/complete`, {});
  }
}
