import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderResponse, OrderStatusUpdateRequest } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getMine(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders/mine`);
  }

  getById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${id}`);
  }

  updateStatus(id: number, status: string): Observable<OrderResponse> {
    const request: OrderStatusUpdateRequest = { status };
    return this.http.patch<OrderResponse>(`${environment.apiUrl}/orders/${id}/status`, request);
  }
}