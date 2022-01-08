import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private theme: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme');

  constructor() { }

  setTheme() {
    const currentThemeUrl = localStorage.getItem('theme');
    this.theme.href = currentThemeUrl ? currentThemeUrl : 'assets/css/colors/blue-dark.css';
  }

  changeTheme(theme: string) {
    const url = `assets/css/colors/${theme}.css`;
    this.theme.href=url;
    this.fillCheckCurrentTheme(url);
    localStorage.setItem('theme', url);
  }

  fillCheckCurrentTheme(themeUrl?: string | null) {
    themeUrl = themeUrl || localStorage.getItem('theme');
    if(themeUrl) {
      const themeName = themeUrl.substring(themeUrl.lastIndexOf('/') + 1).replace('.css', '') + '-theme';
      document.querySelectorAll('.selector').forEach(themeSelector => {
        themeSelector.classList.remove('working');
        if(themeSelector.classList.contains(themeName)) {
          themeSelector.classList.add('working');
        }
      });
    }
  }

}
