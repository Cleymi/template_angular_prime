import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from '@models/appconfig';
import { AppComponent } from '../../app.component';
import { AppMainComponent } from '../main/app.main.component';
import { ConfigService } from '@service/app.config.service';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html'
})
export class AppConfigComponent implements OnInit, OnDestroy {

  scale: number = 14;

  scales: any[] = [12, 13, 14, 15, 16];

  config: AppConfig;

  subscription: Subscription;

  constructor(
    public app: AppComponent,
    public appMain: AppMainComponent,
    public configService: ConfigService,
    public primengConfig: PrimeNGConfig
  ) { }

  ngOnInit() {
    this.configInit();
    if (localStorage.getItem('scale')) {
      this.scale = parseInt(localStorage.getItem('scale'));
    }
    document.documentElement.style.fontSize = this.scale + 'px';
  }

  configInit() {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
      this.scale = 14;
      this.applyScale();
    });
  }

  onConfigButtonClick(event) {
    this.appMain.configActive = !this.appMain.configActive;
    this.appMain.configClick = true;
    event.preventDefault();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
    localStorage.setItem("scale", this.scale.toString())
  }

  changeTheme(theme: string, dark: boolean) {
    let themeElement = document.getElementById('theme-css');
    themeElement.setAttribute('href', 'assets/theme/' + theme + '/theme.css');
    this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
    localStorage.setItem("theme", JSON.stringify({ theme: theme, dark: dark }))
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}