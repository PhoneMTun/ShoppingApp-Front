import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    const token = localStorage.getItem('authToken');

    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Handle errors and redirect if the token is invalid or expired
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // If the token is expired or invalid, clear localStorage and redirect to login
          console.error('Authentication error: ', error.message);
          localStorage.removeItem('authToken'); // Clear the token
          localStorage.removeItem('user'); // Clear user information
          this.router.navigate(['/login'], {
            queryParams: { error: 'Session expired. Please log in again.' },
          });
        }
        return throwError(() => error); // Re-throw the error
      })
    );
  }
}
