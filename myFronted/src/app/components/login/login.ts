import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  loginForm : FormGroup =this.fb.group({
    email: ['' ,[Validators.required , Validators.email]],
    password: ['', [Validators.required , Validators.minLength(6)]]
  });
errorMessage = signal<string>('');

  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/projects']),
        error: () => this.errorMessage.set('פרטי התחברות שגויים')
      });
    }
  }
}
