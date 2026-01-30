import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-create-project',
  imports: [ReactiveFormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject {

@Output() close = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<void>();

  projectForm: FormGroup;
  teams = signal<any[]>([]); // רשימת הצוותים לבחירה

  constructor(private fb: FormBuilder, private authService: Auth) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      teamId: ['', Validators.required],
      description: ['']
    });
  }

  private toast = inject(Toast);

  ngOnInit() {
    // טעינת הצוותים כדי שהמשתמש יוכל לבחור אחד
    this.authService.getTeams().subscribe({
      next: (data) => this.authService.teams.set(data),
      error: () => console.error('Failed to load teams')
    });
    // שימוש ב-Signal של הצוותים מה-Service
    this.teams = this.authService.teams;
  }

  createProject() {
    if (this.projectForm.valid) {
      const { name, teamId, description } = this.projectForm.value;
      this.authService.createProject(Number(teamId), name, description ?? '').subscribe({
        next: () => {
          this.projectCreated.emit();
          this.close.emit();
        },
        error: () => this.toast.show('שגיאה ביצירת פרויקט', 'error')
      });
    }
  }

  cancel() {
    this.close.emit();
  }

}
