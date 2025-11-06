import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'bolgApp-dashboard';

  constructor(private readonly translate: TranslateService) {
    // Set a default language and activate it so translations are loaded on start
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
