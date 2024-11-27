import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseOrderUrl = 'http://localhost:8080/orders';
  private baseProductUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) { }

  getAllOrdersByUser(userId: number): Observable<any>{
    return this.http.get(`${this.baseOrderUrl}/user/${userId}`);
  }
  getAllOrders(): Observable<any>{
    return this.http.get(`${this.baseOrderUrl}/all`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.patch(`${this.baseOrderUrl}/${orderId}/cancel`, {});
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.baseOrderUrl}/${orderId}`);
  }
  getTopFrequentlyPurchased(userId: number, limit: number=3): Observable<any> {
    return this.http.get<any>(`${this.baseProductUrl}/frequent/${limit}?userId=${userId}`);
  }

  getTopRecentlyPurchased(userId: number, limit: number=3): Observable<any> {
    return this.http.get<any>(`${this.baseProductUrl}/recent/${limit}?userId=${userId}`);
  }
  completeOrder(orderId: number): Observable<any> {
    return this.http.patch<any>(`http://localhost:8080/admin/orders/${orderId}/complete`, {});
  }
  getMostProfitableProduct(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/admin/profit/1');
  }
  
  getPopularProducts(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/admin/popular/3');
  }
  
  
  
}

