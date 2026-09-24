export interface OrderResponse {
  id: number;
  totalAmount: number;
  deliveryDate: string;
  status: string;
  clientName: string;
  freelancerName: string;
  jobTitle: string | null;
  serviceTitle: string | null;
  createdAt: string;
}

export interface OrderStatusUpdateRequest {
  status: string;
}