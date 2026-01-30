import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import {  NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 

  private router = inject(Router);
  showLayout = signal(false);

  constructor() {
    this.router.events.pipe(
      // התיקון: הוספנו (event: Event) כדי ש-TS יבין במה מדובר
      filter((event: Event) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      
      const hiddenRoutes = ['/login', '/register', '/'];
      // כאן event כבר מסונן, אז אנחנו בטוחים שהוא NavigationEnd
      const shouldHide = hiddenRoutes.includes(event.urlAfterRedirects);
      this.showLayout.set(!shouldHide);
    });
  }

}
