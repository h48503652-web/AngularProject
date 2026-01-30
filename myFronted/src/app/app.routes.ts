import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Teams } from './components/teams/teams';
import { Projects } from './components/projects/projects';
import { Tasks } from './components/tasks/tasks';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path:'login', component:Login},
    {path:'register' , component:Register},
    {path:'teams' , component:Teams , canActivate: [authGuard]},
    {path: 'projects' , component: Projects, canActivate: [authGuard]},
    {path: 'tasks' , component: Tasks, canActivate: [authGuard]},
    {path:'dashboard' , component:Dashboard, canActivate: [authGuard]},
    {path:'',redirectTo:'login' , pathMatch:'full'}
];


