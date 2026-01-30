import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask {

  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private toast = inject(Toast);

  taskForm: FormGroup;
  projects = signal<any[]>([]);

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      projectId: ['', Validators.required],
      status: ['todo', Validators.required],
      priority: ['normal', Validators.required]
    });
  }

  ngOnInit() {
    // טעינת פרויקטים כדי שהמשתמש יוכל לשייך את המשימה
    this.authService.getProjects().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Failed to load projects', err)
    });
  }

  createTask() {
    if (this.taskForm.valid) {
      this.authService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.taskCreated.emit();
          this.close.emit();
        },
        error: (err) => this.toast.show('שגיאה ביצירת המשימה: ' + (err.error?.error ?? ''), 'error')
      });
    }
  }


}
