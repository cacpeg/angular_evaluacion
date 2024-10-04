import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from "rxjs/operators";


import { CryptojsService } from '../cryptojs/cryptojs.service';
import { of } from "rxjs";
import axios from 'axios';
import { AutenticacionService } from '../api/authentication/authentication.service';
import { environment } from '../../environments/environment.prod';
import { LocalStorageService } from '../local-storage/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorsService implements HttpInterceptor {

  ipAddress: string = "";
  codigoPais: string = "";
  laltitud: string = "";
  longuitud: string = "";
  token: string = "";
  prefix: string;
  private latitud: string = "";
  private longitud: string = "";
  constructor(
    private storage: LocalStorageService,
    private _authService: AutenticacionService,
    private _crypto: CryptojsService
  ) {
    this.prefix = environment.apiUrl;
    this.loadLocationData();
  }

  private loadLocationData(): void {
    const locationData = this.storage.getLocationData();
    console.log("locationData", locationData)
    if (locationData) {
      this.ipAddress = locationData.ipAddress;
      this.codigoPais = locationData.codigoPais;
      this.latitud = locationData.latitud;
      this.longitud = locationData.longitud;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = this.storage.getInformation()?.token;
    let request = req.clone();

    var extractInfo = of({});
    console.log("Interceptor", req.url)
    if (!this.ipAddress) {
      extractInfo = from(axios.get('https://freeipapi.com/api/json')).pipe(
        tap((response: any) => {
          const res = response.data;
          this.ipAddress = res.ipAddress;
          this.codigoPais = res.countryCode;
          this.latitud = res.latitude.toString();
          this.longitud = res.longitude.toString();
          
          // Guardar los datos en el almacenamiento local
          this.storage.setLocationData({
            ipAddress: this.ipAddress,
            codigoPais: this.codigoPais,
            latitud: this.latitud,
            longitud: this.longitud
          });
        }),
        catchError(error => {
          console.error('Error fetching IP info:');
          return of({});
        })
      );
    }
    return extractInfo.pipe(
      tap(() => {
        request = this.addHeaders(req);
      }),
      switchMap(res => next.handle(request).pipe(
        shareReplay(),
        map((event) => {
          if (event instanceof HttpResponse) {
            if (environment.encriptacion) {
              event = event.clone({ body: JSON.parse(this._crypto.desencriptar(event.body['value'])) });
            }
            if (!event.body.ok) {
              throw event.body
            }
          }
          return event;
        }),
        catchError((err: any) => {
          if (err.hasOwnProperty('ok') && err.hasOwnProperty('messages')) {
            return throwError(err)
          }

          if (err instanceof ErrorEvent) {
            console.log(err.error.message)
            return throwError({
              ok: false,
              messages: [{ text: err.error.message }]
            })
          }

          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 403:
                return this.handle401Error(request, next)
              case 409:
                return this.handle409Error(request, next);
              case 0:
                return throwError({
                  ok: false,
                  messages: [{ text: err.message }]
                })
            }
          }

          return throwError({
            ok: false,
            messages: [{ text: err.message }]
          })
        })
      )
      )
    );
  }

  private addToken(request: HttpRequest<any>) {
    let token = this.storage.getInformation().token ?? ''

    return request.clone({
      setHeaders: { 'Authorization': `Bearer ${token}` }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this._authService.cerrarSesion()
    return throwError('')
    // return this.authService.refreshToken()
    // .pipe(
    // 	switchMap(token => {
    // 		this.authService.updateToken(token)
    // 		return next.handle(this.addToken(request))
    // 	}),
    // 	catchError(() => {
    // 		this.authService.logOut();
    // 		return throwError("Your session has expired");
    // 	})
    // )
  }

  private handle409Error(request: HttpRequest<any>, next: HttpHandler) {
    this._authService.cerrarSesion()
    return throwError('')
  }

  private addHeaders(req: HttpRequest<any>) {
    let separator = ''
    if (req.url.charAt(0) != '/') separator = '/'

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json')
    headers = headers.set('dispositivo', this._crypto.encriptar(`{"idDispositivo": "Web-${this.ipAddress}", "modelo": "modelo chrome", "codigoTipoDispositivo": 1}`))
    headers = headers.set('posicion', this._crypto.encriptar(`{"longitud": "${this.longuitud}", "latitud": "${this.laltitud}", "altitud": "0.0", "isMocked":false}`))
    headers = headers.set('ippublica', this._crypto.encriptar(this.ipAddress))
    headers = headers.set('codigopais', this._crypto.encriptar(this.codigoPais))
    headers = headers.set('canaltransferencia', this._crypto.encriptar("WEB"))
    req = req.clone({
      headers: headers,
      url: `${this.prefix}${separator}${req.url}`,
      withCredentials: true,
    });

    if (this.token) {
      req = this.addToken(req);
    }

    if (environment.encriptacion && req.method.toUpperCase() != "GET" && req.method.toUpperCase() != "DELETE") {
      req = req.clone({
        body: { value: this._crypto.encriptar(JSON.stringify(req.body)) },
      });
    }

    return req;
  }
}
