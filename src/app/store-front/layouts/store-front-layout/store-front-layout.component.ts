import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavBarComponent } from '../../components/front-nav-bar/front-nav-bar.component';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavBarComponent],
  templateUrl: './store-front-layout.component.html',
  styleUrl: './store-front-layout.component.css',
})
export class StoreFrontLayoutComponent {}
