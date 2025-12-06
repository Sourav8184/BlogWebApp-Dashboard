import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      this.userEmail = user?.email ?? null;
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.toastr.success(this.translate.instant('LOGOUT_SUCCESS'));
      this.router.navigate(['/login']);
    } catch (error) {
      this.toastr.error(this.translate.instant('LOGOUT_FAILED'));
      console.error('Logout error:', error);
    }
  }
}
