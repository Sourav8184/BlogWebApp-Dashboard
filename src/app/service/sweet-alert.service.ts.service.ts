import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor(private readonly translate: TranslateService) {}

  confirmDelete(): Promise<SweetAlertResult<boolean>> {
    return Swal.fire({
      title: this.translate.instant('CONFIRM_DELETE_TITLE'),
      text: this.translate.instant('CONFIRM_DELETE_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('YES_DELETE'),
      cancelButtonText: this.translate.instant('CANCEL'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true,
      background: '#fff',
      color: '#333',
    });
  }
}
