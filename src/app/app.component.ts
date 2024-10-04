import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PruebasService } from '../services/api/pruebas';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular_evaluacion';
  private readonly _pruebasService = inject(PruebasService);
  agencias = signal<any[]>([]);

  cargando=signal(false);

  async getAgencias(){
    this.cargando.set(true);
    try {
      let dataAgencias= await firstValueFrom(this._pruebasService.obtenerAgencias());
      console.log(dataAgencias);
      this.agencias.set(dataAgencias.data);
      this.cargando.set(false);
    } catch (error) {
      console.log(error);
      this.cargando.set(false);
    }
  }
}
