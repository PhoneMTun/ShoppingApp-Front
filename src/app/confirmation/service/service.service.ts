import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private apiUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  // Place an order
  placeOrder(orderPayload: any): Observable<any> {
    return this.http.post(this.apiUrl, orderPayload);
  }
}
