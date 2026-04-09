import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthServiceService } from '@auth/services/auth-service.service';

@Component({
  selector: 'front-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-nav-bar.component.html',
  styleUrl: './front-nav-bar.component.css',
})
export class FrontNavBarComponent {
  autService = inject(AuthServiceService);
}
