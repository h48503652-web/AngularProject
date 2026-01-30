import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateProject } from '../create-project/create-project';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [ReactiveFormsModule,  CreateProject],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

  private authService=inject(Auth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  projects=signal<any[]>([]);
  loading = signal(true);

 showCreateForm = signal<boolean>(false);

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const teamIdParam = params.get('teamId');
      const teamId = teamIdParam ? Number(teamIdParam) : undefined;
      this.loadProjects(teamId);
    });
  }

 loadProjects(teamId?: number) {
    this.loading.set(true);
    this.authService.getProjects(teamId).subscribe({
      next: (data) => {
        const projects = teamId ? data.filter((p: any) => p.team_id === teamId) : data;
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching projects', err);
        this.loading.set(false);
      }
    });
  }

  openProjectTasks(projectId: number) {
    this.router.navigate(['/tasks'], { queryParams: { projectId } });
  }
}
