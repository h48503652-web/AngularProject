import { Component, computed, inject, signal, HostBinding } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { Icon } from '../icon/icon';

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

  toggleCollapsed() {
    this.collapsed.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
