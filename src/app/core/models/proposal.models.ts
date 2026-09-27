export interface ProposalResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  coverLetter: string;
  proposedPrice: number;
  deliveryDays: number;
  status: string;
  freelancerName: string;
  freelancerProfileId: number;
  createdAt: string;
}

export interface ProposalCreateRequest {
  jobId: number;
  coverLetter: string;
  proposedPrice: number;
  deliveryDays: number;
}