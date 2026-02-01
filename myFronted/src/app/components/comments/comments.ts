import { Component, inject, Input, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {  DatePipe } from '@angular/common';
import { Icon } from "../icon/icon";

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, DatePipe, Icon],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {

@Input({ required: true }) taskId!: number;
  private authService = inject(Auth);

  
  comments = signal<any[]>([]);
  

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
       
        this.comments.update(prev => [...prev, newComment]);
        this.commentControl.reset(); 
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
