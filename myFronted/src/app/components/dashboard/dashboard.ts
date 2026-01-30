import { Component, computed, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private authService = inject(Auth);
  
  // משתנה עבור התאריך בכותרת
  now = new Date();

  projects = signal<any[]>([]);
  tasks = signal<any[]>([]);
  loading = signal(true);

  // --- חישובים ---
  totalProjects = computed(() => this.projects().length);
  
  pendingTasks = computed(() => 
    this.tasks().filter(t => t.status !== 'done').length
  );

  completionRate = computed(() => {
    const total = this.tasks().length;
    if (total === 0) return 0;
    const done = this.tasks().filter(t => t.status === 'done').length;
    return Math.round((done / total) * 100);
  });

  recentTasks = computed(() => {
    return [...this.tasks()].sort((a, b) => b.id - a.id).slice(0, 4); // מציגים 4 אחרונות
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    // כאן אמור להיות הקוד ששולף את הנתונים (כמו בגרסה הקודמת)
    // לצורך הדגמת העיצוב, נניח שהנתונים נטענים
    this.authService.getProjects().subscribe(data => this.projects.set(data));
    this.authService.getTasks().subscribe(data => {
        this.tasks.set(data);
        this.loading.set(false);
    });
  }
}
