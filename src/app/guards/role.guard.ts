import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Retrieve current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      console.error('No user data found in local storage. Redirecting to login.');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const user = JSON.parse(storedUser); // Parse user data
      const userIdFromRoute = parseInt(route.params['userId'], 10); // Extract `userid` from route parameters

      // Check if the user is a "USER" role and is accessing another user's orders
      if (user.role === 'USER' && user.id !== userIdFromRoute) {
        console.error('Unauthorized access attempt by user.');
        this.router.navigate(['/unauthorized']); // Redirect to unauthorized page
        return false;
      }

      return true; // Allow access if the user is admin or the owner of the order
    } catch (error) {
      console.error('Error parsing user data from local storage:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
