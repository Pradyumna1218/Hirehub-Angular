import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProposalService } from '../../../core/services/proposal';
import { ProposalResponse } from '../../../core/models/proposal.models';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-my-proposals',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-proposals.html',
  styleUrl: './my-proposals.scss'
})
export class MyProposals implements OnInit {
  proposals = signal<ProposalResponse[]>([]);
  isLoading = signal(true);

  private platformId = inject(PLATFORM_ID);

  constructor(private proposalService: ProposalService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    this.proposalService.getMine().subscribe({
      next: (proposals) => {
        this.proposals.set(proposals);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}