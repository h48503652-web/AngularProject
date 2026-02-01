import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Team } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private API_URL = environment.apiBaseUrl;

 
  private token: string | null = null;

  currentUser = signal<any>(null);
  teams= signal<Team[]>([]);

  constructor(){
    const sessionToken = sessionStorage.getItem('token');
    const token = sessionToken;
    if(token) {
      this.token = token;
    }

    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch {}
    }
  }
  register(userData : any){
    return this.http.post(`${this.API_URL}/auth/register`,userData).pipe(
      tap((res:any)=> this.handleAuth(res))
    );
  }
  login(credentials : any){
    return this.http.post(`${this.API_URL}/auth/login`,credentials).pipe(
      tap((res: any)=>this.handleAuth(res))
    );
  }

  private handleAuth(res: any){
  this.token = res.token;
  try { sessionStorage.setItem('token', res.token); } catch (e) {}
  try { sessionStorage.setItem('user', JSON.stringify(res.user)); } catch (e) {}
  this.currentUser.set(res.user);
  }

  logout()
  {
    this.token = null;
    try { sessionStorage.removeItem('token'); } catch (e) {}
    try { sessionStorage.removeItem('user'); } catch (e) {}
    this.currentUser.set(null);
  }

  // helper for other parts of the app (guard/interceptor)
  getToken() {
    if (this.token) return this.token;
    const s = sessionStorage.getItem('token');
    if (s) { this.token = s; return s; }
    return null;
  }

  getTeams(){
    return this.http.get<Team[]>(`${this.API_URL}/teams`);
  }

  createTeam(name: string){
    return this.http.post<any>(`${this.API_URL}/teams`,{name}).pipe(
      tap(newTeam=>{
        this.teams.update(teams=>[...teams , newTeam]);
      })
    );
  }

 addMemberToTeam(teamId: number, userId: number) {
  return this.http.post<any>(`${this.API_URL}/teams/${teamId}/members`, { userId, role: 'member' });
}
  
getProjects(teamId?: number){
  let url = `${this.API_URL}/projects`;
  return this.http.get<any[]>(url);
}
 
createProject(teamId : number , projectName : string, description = ''){
  return this.http.post<any>(`${this.API_URL}/projects` , {
    name: projectName,
    teamId: teamId,
    description
  });
}
  

getTasks(projectId?: number) {
  let url = `${this.API_URL}/tasks`;
  if (projectId) url += `?projectId=${projectId}`;
  return this.http.get<any[]>(url);
}


createTask(taskData: any) {
  const payload = {
    status: 'todo',
    priority: 'normal',
    ...taskData,
  };
  return this.http.post<any>(`${this.API_URL}/tasks`, payload);
}


updateTask(id: number, updates: any) {
  return this.http.patch<any>(`${this.API_URL}/tasks/${id}`, updates);
}


deleteTask(id: number) {
  return this.http.delete<any>(`${this.API_URL}/tasks/${id}`);
}

getComments(taskId: number) {
  return this.http.get<any[]>(`${this.API_URL}/comments?taskId=${taskId}`);
}


addComment(taskId: number, content: string) {
  
  const payload = { 
    taskId: taskId, 
    body: content 
  };
  
  return this.http.post<any>(`${this.API_URL}/comments`, payload);
}

}
