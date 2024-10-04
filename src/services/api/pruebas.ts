import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Response } from "../../models/response";
import { Observable } from "rxjs";



@Injectable({
    providedIn: "root",
  })
  export class PruebasService {

    private readonly _http= inject(HttpClient);
    obtenerAgencias():Observable<any> {
		return this._http.get<Response<any[]>>(`informacion/agencias`).pipe(map=> map);
	}
  }  