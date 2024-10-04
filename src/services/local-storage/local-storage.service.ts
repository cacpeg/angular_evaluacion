import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';
import { LocalStorageTypes } from './local-storage-types';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private secretKey: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.secretKey = this.generateSecretKey();
  }

  private generateSecretKey(): string {
    if (isPlatformBrowser(this.platformId)) {
      let navigator_info = window.navigator;
      let screen_info = window.screen;
      let uid = navigator_info?.mimeTypes?.length?.toString() || '';
      uid += screen_info?.orientation?.angle || '';
      uid += navigator_info?.userAgent?.replace(/\D+/g, '');
      uid += screen_info?.colorDepth || '';
      uid += navigator_info?.plugins?.length || '';
      uid += screen_info?.pixelDepth || '';
      uid += navigator_info?.hardwareConcurrency?.toLocaleString() || '';

      return uid;
    }
    let uid = uuidv4(); // Genera un UUID único
    uid += new Date().getTime().toString();
    return uid;
  }

  getLocationData(): any {
    if (isPlatformBrowser(this.platformId)) {
      return this.getStorage({ key: 'locationData' });
    }
    return null; // Si no está en el navegador, no hace nada
  }

  setLocationData(data: { ipAddress: string, codigoPais: string, latitud: string, longitud: string }): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setStorage({ key: 'locationData' }, data);
    }
  }

  private getKey(key: string): string {
    return CryptoJS.SHA224(key).toString();
  }

  getStorage(keyTypes: LocalStorageTypes): any {
    if (isPlatformBrowser(this.platformId)) {
      try {
        let key = this.getKey(keyTypes.key);
        let data = localStorage.getItem(key);

        if (data) {
          let dataDecrypted = CryptoJS.AES.decrypt(data, this.secretKey).toString(CryptoJS.enc.Utf8);
          return JSON.parse(dataDecrypted) || dataDecrypted;
        }
      } catch (ex) {
        return null;
      }
    }
    return null;
  }

  setStorage(keyTypes: LocalStorageTypes, data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      let key = this.getKey(keyTypes.key);
      let dataEncrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
      localStorage.setItem(key, dataEncrypted);
    }
  }

  getInformation(): any {
    if (isPlatformBrowser(this.platformId)) {
      let storage: any = this.getStorage({ key: 'sesion' });
      let sesion: any = storage;
      return sesion;
    }
    return null;
  }

  clear(keyTypes: LocalStorageTypes): void {
    if (isPlatformBrowser(this.platformId)) {
      let key = this.getKey(keyTypes.key);
      localStorage.removeItem(key);
    }
  }
}
