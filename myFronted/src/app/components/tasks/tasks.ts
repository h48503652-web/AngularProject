import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { CreateTask } from '../create-task/create-task';
import { Comments } from '../comments/comments';
import { Toast } from '../../services/toast';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tasks',
  imports: [CreateTask,Comments],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {

  private authService = inject(Auth);
  private toast = inject(Toast);
  private route = inject(ActivatedRoute);

  tasks = signal<any[]>([]);
  expandedTaskId = signal<number | null>(null);
  loading = signal(true);
  showCreateForm = signal(false);
  projectId = signal<number | null>(null);
  updatingIds = signal<Set<number>>(new Set());

  readonly statusOptions = [
    { value: 'todo', label: 'Todo' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'done', label: 'Done' },
  ] as const;

  readonly priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
  ] as const;

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const projectIdParam = params.get('projectId');
      this.projectId.set(projectIdParam ? Number(projectIdParam) : null);
      this.loadTasks();
    });
  }

  loadTasks() {
    this.loading.set(true);
    this.authService.getTasks(this.projectId() ?? undefined).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching tasks', err);
        this.loading.set(false);
      }
    });
  }

  toggleComplete(task: any) {
  const newStatus = task.status === 'done' ? 'todo' : 'done';
  
  this.updateTask(task.id, { status: newStatus });
}

  isUpdating(taskId: number) {
    return this.updatingIds().has(taskId);
  }

  onStatusChange(task: any, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (!value || value === task.status) return;
    this.updateTask(task.id, { status: value });
  }

  onPriorityChange(task: any, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (!value || value === task.priority) return;
    this.updateTask(task.id, { priority: value });
  }

  private updateTask(taskId: number, updates: any) {
    this.updatingIds.update(set => {
      const next = new Set(set);
      next.add(taskId);
      return next;
    });

    this.authService.updateTask(taskId, updates).pipe(
      finalize(() => {
        this.updatingIds.update(set => {
          const next = new Set(set);
          next.delete(taskId);
          return next;
        });
      })
    ).subscribe({
      next: (updated) => {
        this.tasks.update(allTasks => allTasks.map(t => t.id === taskId ? { ...t, ...updates, ...(updated ?? {}) } : t));
      },
      error: (err) => this.toast.show('שגיאה בעדכון המשימה: ' + (err.error?.error ?? ''), 'error')
    });
  }

removeTask(id: number) {
  if (confirm('האם את בטוחה שברצונך למחוק את המשימה הזו?')) {
    this.authService.deleteTask(id).subscribe({
      next: () => {
        // הסרת המשימה מהרשימה ב-Signal
        this.tasks.update(allTasks => allTasks.filter(t => t.id !== id));
      },
      error: (err) => this.toast.show('שגיאה במחיקת המשימה: ' + (err.error?.error ?? ''), 'error')
    });
  }
}
toggleComments(taskId: number) {
  // אם לוחצים על אותה משימה - היא תיסגר. אם על אחרת - היא תיפתח.
  this.expandedTaskId.update(id => id === taskId ? null : taskId);
}

}
