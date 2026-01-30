import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CreateTeam } from '../create-team/create-team';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-teams',
  imports: [CreateTeam],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  private authService = inject(Auth);
  private router = inject(Router);
  private toast = inject(Toast);
  teams=this.authService.teams;
  showCreateForm = false;

  ngOnInit(){
    this.authService.getTeams().subscribe({
      next: (data) => this.authService.teams.set(data),
      error: (err) => this.toast.show('שגיאה בטעינת הצוותים', 'error')
    });
  }

addMember(teamId: number, userIdValue: string) {
  // המרה למספר כבר כאן
  const userId = parseInt(userIdValue, 10); 
  
  if (isNaN(userId)) {
    this.toast.show('נא להזין מספר ID תקין', 'error');
    return;
  }

  this.authService.addMemberToTeam(teamId, userId).subscribe({
    next: () => {
      this.toast.show('החבר נוסף!', 'success');
      this.authService.getTeams().subscribe({
        next: (data) => this.authService.teams.set(data),
        error: () => this.toast.show('שגיאה בעדכון רשימת הצוותים', 'error')
      });
    },

    error: ()=> {
      this.toast.show('ההוספה נכשלה', 'error');
    }
  });
}

goToProjects(teamId: number){
  this.router.navigate(['/projects'], { queryParams: { teamId } });

}

}
