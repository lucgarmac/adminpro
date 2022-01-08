import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

declare function customInitFunctions(): void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent {

  year = new Date().getFullYear();
  
  constructor(private settingsService: SettingsService){
    customInitFunctions();
    this.settingsService.setTheme();
  }
}
