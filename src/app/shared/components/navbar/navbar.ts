import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';
import { NotificationResponse } from '../../../core/models/notification.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  notifications = signal<NotificationResponse[]>([]);
  unreadCount = signal(0);
  showDropdown = signal(false);

  private platformId = inject(PLATFORM_ID);

  constructor(public authService: AuthService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.authService.isLoggedIn()) {
      this.refreshUnreadCount();
    }
  }

  refreshUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount.set(res.count)
    });
  }

  toggleDropdown(): void {
    this.showDropdown.set(!this.showDropdown());
    if (this.showDropdown()) {
      this.notificationService.getMine().subscribe({
        next: (list) => this.notifications.set(list)
      });
      this.notificationService.markAllRead().subscribe({
        next: () => this.unreadCount.set(0)
      });
    }
  }
}