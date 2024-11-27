import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Handle error message passed through query parameters
    this.route.queryParams.subscribe((params) => {
      if (params['error']) {
        this.errorMessage = params['error'];
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response: any) => {
          console.log('Login successful', response);

          // Extract and store token
          const token = response.data.accessToken;
          localStorage.setItem('authToken', token);

          // Store user information if needed
          const user = response.data.user;
          localStorage.setItem('user', JSON.stringify(user));

          // Redirect to a secure page
          this.router.navigate(['/homepage']);
        },
        (error: any) => {
          console.error('Login failed', error);

          // Display an error message to the user
          this.errorMessage =
            error.error?.message || 'Login failed. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

  closeErrorMessage(): void {
    this.errorMessage = null; // Clear the error message
  }
}
