import { Component, EventEmitter, Input, inject, Output, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Toast } from '../../services/toast';
import { DatePipe } from '@angular/common';
import { Icon } from "../icon/icon"; 

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule, Icon],
  providers: [DatePipe], 
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask implements OnInit {

  @Input() taskToEdit: any = null; 
  @Output() close = new EventEmitter<void>();
  @Output() taskSaved = new EventEmitter<void>(); 

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private toast = inject(Toast);
  private datePipe = inject(DatePipe);

  taskForm: FormGroup;
  projects = signal<any[]>([]);
  isEditMode = false;

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      projectId: ['', Validators.required],
      status: ['todo', Validators.required],
      priority: ['normal', Validators.required]
    });
  }

  ngOnInit() {
    if (this.taskToEdit) {
      this.isEditMode = true;
      this.fillFormWithTaskData();
    }

    
    this.authService.getProjects().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Failed to load projects', err)
    });
  }

  private fillFormWithTaskData() {
    let formattedDate = '';
    if (this.taskToEdit.due_date) {
      try {
        formattedDate = this.datePipe.transform(this.taskToEdit.due_date, 'yyyy-MM-dd') || '';
      } catch (e) {
        console.error('Date parsing error', e);
      }
    }

    this.taskForm.patchValue({
      title: this.taskToEdit.title,
      description: this.taskToEdit.description,
      due_date: formattedDate,
      projectId: this.taskToEdit.project_id || this.taskToEdit.projectId,
      status: this.taskToEdit.status,
      priority: this.taskToEdit.priority
    });
  }

  saveTask() {
    if (this.taskForm.invalid) return;

    if (this.isEditMode) {
      const updates = this.taskForm.value;
      this.authService.updateTask(this.taskToEdit.id, updates).subscribe({
        next: () => {
          this.toast.show('המשימה עודכנה בהצלחה', 'success');
          this.taskSaved.emit();
          this.close.emit();
        },
        error: (err) => this.toast.show('שגיאה בעדכון: ' + (err.error?.error ?? ''), 'error')
      });

    } else {
      
      this.authService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.toast.show('המשימה נוצרה בהצלחה', 'success');
          this.taskSaved.emit();
          this.close.emit();
        },
        error: (err) => this.toast.show('שגיאה ביצירה: ' + (err.error?.error ?? ''), 'error')
      });
    }
  }
}