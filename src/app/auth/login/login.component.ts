import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const { email, password } = form.value;

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login(email, password)
      .then(() => {
        this.loading = false;
        this.toastr.success(this.translate.instant('LOGIN_SUCCESS'));
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.loading = false;
        this.errorMessage = err.message;
        this.toastr.error(this.translate.instant('LOGIN_FAILED'));
      });
  }
}
