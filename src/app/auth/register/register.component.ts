import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER'],
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { username, email, password, role } = this.registerForm.value;
      this.authService.register({ username, email, password, role }).subscribe(
        (response: any) => {
          console.log('Registration successful', response);
          this.errorMessage = null; // Clear error message on success
          this.router.navigate(['/login']); // Redirect to login page
        },
        (error: any) => {
          console.error('Registration failed', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      );
    }
  }

  clearErrorMessage(): void {
    this.errorMessage = null; // Clear the error message
  }
}
