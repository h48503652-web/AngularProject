import { Component, computed, inject, signal, HostBinding, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Auth } from '../../services/auth';
import { Icon } from '../icon/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive ,Icon],
  
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @HostBinding('class.collapsed') get hostCollapsed() { return this.collapsed(); }
  private authService = inject(Auth);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.name ?? 'משתמש';
  });

  userInitials = computed(() => {
    const name = (this.userName() ?? '').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? 'M';
    const second = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1];
    return (first + (second ?? '')).toUpperCase();
  });

  collapsed = signal(false);

  constructor() {
    // Auto-close sidebar on route navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (!this.collapsed()) {
        this.collapsed.set(true);
      }
    });
  }

  toggleCollapsed() {
    this.collapsed.update(v => !v);
  }

  // Close sidebar when clicking outside on mobile
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const sidebar = this.elementRef.nativeElement.querySelector('.sidebar');
    const toggleBtn = this.elementRef.nativeElement.querySelector('.collapse-btn');
    
    if (sidebar && !this.collapsed() && window.innerWidth < 768) {
      if (!sidebar.contains(event.target as Node) && !toggleBtn?.contains(event.target as Node)) {
        this.collapsed.set(true);
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
