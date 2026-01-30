import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
 imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb=inject(FormBuilder);
  private authService= inject(Auth);
  private router=inject(Router);

errorMessage = signal<string>('');

  registerForm=this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['',[Validators.required, Validators.email]],
    password: ['', [Validators.required , Validators.minLength(6)]]
  });

  onSubmit(){
    if(this.registerForm.valid){
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.errorMessage.set('ההרשמה נכשלה. ייתכן שהמשתמש כבר קיים במערכת.');
        }
      });
    }
  }

}
