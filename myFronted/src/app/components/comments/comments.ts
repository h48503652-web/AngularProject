import { Component, inject, Input, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {  DatePipe } from '@angular/common';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule,DatePipe],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {

@Input({ required: true }) taskId!: number;
  private authService = inject(Auth);

  // שימוש ב-Signal לניהול רשימת התגובות
  comments = signal<any[]>([]);
  
  // הדרך הנכונה: FormControl במקום ngModel
  commentControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.authService.getComments(this.taskId).subscribe({
      next: (data) => this.comments.set(data),
      error: (err) => console.error('Failed to load comments', err)
    });
  }

  sendComment() {
    if (this.commentControl.invalid) return;

    const content = this.commentControl.value as string;

    this.authService.addComment(this.taskId, content).subscribe({
      next: (newComment) => {
        // עדכון ה-Signal בצורה אימוטבילית
        this.comments.update(prev => [...prev, newComment]);
        this.commentControl.reset(); // ניקוי השדה
        this.scrollToBottom();
      },
      error: (err) => console.error('Error sending comment', err)
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const list = document.querySelector('.comments-list');
      if (list) list.scrollTop = list.scrollHeight;
    }, 50);
  }

}
