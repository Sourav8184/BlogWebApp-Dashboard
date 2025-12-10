import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getUser().pipe(
      take(1),
      map((user) => {
        if (user) {
          return true;
        }

        // For other protected routes, show a permission warning then redirect
        this.translate.get('LOGIN_PERMISSION').subscribe((message) => {
          this.toastr.warning(message);
        });
        this.router.navigate(['/login']);
        return false;
      }),
    );
  }
}
