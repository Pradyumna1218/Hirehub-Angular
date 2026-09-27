import { Component, OnInit, OnDestroy, signal, inject, PLATFORM_ID } from '@angular/core';
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
export class Navbar implements OnInit, OnDestroy {
  notifications = signal<NotificationResponse[]>([]);
  unreadCount = signal(0);
  showDropdown = signal(false);

  private platformId = inject(PLATFORM_ID);
  private pollHandle: ReturnType<typeof setInterval> | null = null;

  constructor(public authService: AuthService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.authService.isLoggedIn()) {
      this.refreshAll();
      this.pollHandle = setInterval(() => {
        if (this.authService.isLoggedIn()) {
          this.refreshAll();
        }
      }, 15000); // check every 15 seconds
    }
  }

  ngOnDestroy(): void {
    if (this.pollHandle) {
      clearInterval(this.pollHandle);
    }
  }

  refreshAll(): void {
    // Always refresh the list itself, so it's current the moment the dropdown opens
    this.notificationService.getMine().subscribe({
      next: (list) => this.notifications.set(list)
    });

    this.notificationService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount.set(res.count)
    });
  }

  toggleDropdown(): void {
    this.showDropdown.set(!this.showDropdown());

    if (this.showDropdown()) {
      // Only mark as read when the user actually opens it, not on a background poll
      this.notificationService.markAllRead().subscribe({
        next: () => this.unreadCount.set(0)
      });
    }
  }
}