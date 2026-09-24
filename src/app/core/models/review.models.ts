export interface ReviewCreateRequest {
  orderId: number;
  rating: number;
  comment: string | null;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string | null;
  clientName: string;
  freelancerName: string;
  createdAt: string;
}