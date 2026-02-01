import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Toast } from '../../services/toast';
import { Icon } from "../icon/icon";

@Component({
  selector: 'app-create-team',
   imports: [ReactiveFormsModule, Icon],
  templateUrl: './create-team.html',
  styleUrl: './create-team.css',
})
export class CreateTeam {

  authService= inject(Auth)
  private toast = inject(Toast);

  close = output<void>();

  teamForm=new FormGroup({
    name:new FormControl('', Validators.required)
  });

  cancel() {
    this.close.emit(); 
  }

  createTeam() {
  if (this.teamForm.valid) {
    
    const nameValue = this.teamForm.value.name as string

    this.authService.createTeam(nameValue).subscribe({
      next: () => {
        this.teamForm.reset();
        this.close.emit();
      },
      error: () => {
        this.toast.show('לא הצלחנו ליצור את הצוות', 'error');
      }
    });
  }
}
 
}


