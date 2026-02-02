import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { CreateTeam } from '../create-team/create-team';

@Component({
  selector: 'app-teams',
  imports: [CreateTeam],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  private authService = inject(Auth);
  teams=this.authService.teams;
  showCreateForm = false;

  ngOnInit(){
    this.authService.getTeams();
  }

addMember(teamId: number, userIdValue: string) {
  // המרה למספר כבר כאן
  const userId = parseInt(userIdValue, 10); 
  
  if (isNaN(userId)) {
    alert('נא להזין מספר ID תקין');
    return;
  }

  this.authService.addMemberToTeam(teamId, userId).subscribe({
    next: () => {
      alert('החבר נוסף!');
      this.authService.getTeams();
    },

    error: ()=> {
      alert('ההוספה ניכשלה')
    }
  });
}

goToProjects(teamId: number){

  
}

}
