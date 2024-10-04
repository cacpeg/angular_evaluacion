import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AutenticacionService {

  
  constructor( 
    private _router: Router,
  ) { }

 
 

  cerrarSesion() {
  
    this._router.navigateByUrl("/login");
  }

}
