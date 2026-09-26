import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order';
import { ReviewService } from '../../../core/services/review';
import { AuthService } from '../../../core/services/auth';
import { OrderResponse } from '../../../core/models/order.models';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss'
})
export class MyOrders implements OnInit {
  orders = signal<OrderResponse[]>([]);
  isLoading = signal(true);
  actionError = signal<string | null>(null);

  reviewingOrderId = signal<number | null>(null);
  reviewData = { rating: 5, comment: '' };
  reviewedOrderIds = signal<Set<number>>(new Set());

  private platformId = inject(PLATFORM_ID);

  constructor(
    private orderService: OrderService,
    private reviewService: ReviewService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.orderService.getMine().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  isFreelancer(order: OrderResponse): boolean {
    return this.authService.currentUser()?.fullName === order.freelancerName;
  }

  isClient(order: OrderResponse): boolean {
    return this.authService.currentUser()?.fullName === order.clientName;
  }

  updateStatus(orderId: number, status: string): void {
    this.actionError.set(null);
    this.orderService.updateStatus(orderId, status).subscribe({
      next: () => this.loadOrders(),
      error: (err) => this.actionError.set(err.error?.message ?? 'Failed to update order.')
    });
  }

  openReviewForm(orderId: number): void {
    this.reviewingOrderId.set(orderId);
    this.reviewData = { rating: 5, comment: '' };
  }

  submitReview(orderId: number): void {
    this.actionError.set(null);
    this.reviewService.create({
      orderId,
      rating: this.reviewData.rating,
      comment: this.reviewData.comment || null
    }).subscribe({
      next: () => {
        this.reviewingOrderId.set(null);
        this.reviewedOrderIds.update(set => new Set(set).add(orderId));
      },
      error: (err) => this.actionError.set(err.error?.message ?? 'Failed to submit review.')
    });
  }
}