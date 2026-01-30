import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Toast {
  show(message: string, type: 'info' | 'success' | 'error' = 'info', duration = 3500) {
    try {
      const el = document.createElement('div');
      el.textContent = message;
      el.classList.add('app-toast', `app-toast--${type}`);
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');

      document.body.appendChild(el);
      // trigger fade in
      requestAnimationFrame(() => el.classList.add('app-toast--visible'));

      setTimeout(() => {
        el.classList.remove('app-toast--visible');
        setTimeout(() => el.remove(), 200);
      }, duration);
    } catch (e) {
      // fallback
      alert(message);
    }
  }
}
