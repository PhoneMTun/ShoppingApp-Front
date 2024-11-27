import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseProductUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) { }

  getProductById(productId: number): Observable<any> {
    return this.http.get(`${this.baseProductUrl}/${productId}`);
  }
}
