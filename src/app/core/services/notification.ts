import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationResponse } from '../models/notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getMine(): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(`${environment.apiUrl}/notifications`);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${environment.apiUrl}/notifications/unread-count`);
  }

  markAllRead(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/notifications/mark-read`, {});
  }
}