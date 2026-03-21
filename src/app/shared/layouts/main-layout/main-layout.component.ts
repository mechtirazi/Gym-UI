import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { OwnerSidebarComponent } from './sidebars/owner-sidebar/owner-sidebar.component';
import { MemberSidebarComponent } from './sidebars/member-sidebar/member-sidebar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent, 
    OwnerSidebarComponent, 
    MemberSidebarComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  userRole = this.authService.userRole;
}
