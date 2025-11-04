/// <reference types="google.maps" />
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { Router } from '@angular/router';

interface RouteStopDTO {
  entregaId: number;
  clienteId: number;
  clienteNome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  distanceFromPreviousMeters: number;
  position: number;
}

interface RouteDTO {
  date: string;
  totalDistanceMeters: number;
  stops: RouteStopDTO[];
}

@Component({
  selector: 'app-atualizacao-rota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atualizacao-rota.component.html',
  styleUrls: ['./atualizacao-rota.component.scss'],
})
export class AtualizacaoRotaComponent implements OnInit, AfterViewInit {
  rota?: RouteDTO;
  loading = true;
  
  @ViewChild('mapContainer', { static: false }) mapElement?: ElementRef;
  map!: google.maps.Map;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  
  constructor(
    private api: ApiService,
    private mapsLoader: GoogleMapsLoaderService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.carregarRota();
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.mapsLoader.load('AIzaSyAhxn4F2okcGS6WJK0vyuj1qCuD-A0JIcI');
    } catch (err) {
      console.error('Erro ao carregar Google Maps API:', err);
      this.loading = false;
    }
  }
  
  voltar(): void {
    const perfil = localStorage.getItem('perfil');
    if (perfil === 'ADMIN') {
      this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  private carregarRota(): void {
    const hoje = new Date().toISOString().split('T')[0];
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('Usuário não autenticado. Permanece na tela atual.');
      this.loading = false;
      return;
    }

    this.api.get<RouteDTO>(`/rotas/data/${hoje}`).subscribe({
      next: (data) => {
        this.rota = {
          ...data,
          date: this.formatarDataBrasil(data.date)
        };

        this.loading = false;
        
        setTimeout(() => {
          if (this.rota && this.rota.stops.length > 0) {
            this.initMap();
          }
        }, 300);
      },
      error: (err) => {
        console.error('Erro ao carregar rota:', err);
        this.loading = false;
      },
    });
  }

  private formatarDataBrasil(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  }
  
  private initMap(): void {
    if (!this.rota || this.rota.stops.length === 0 || !this.mapElement) return;
    
    const mapDiv = this.mapElement.nativeElement as HTMLElement;
    const center = {
      lat: this.rota.stops[0].latitude,
      lng: this.rota.stops[0].longitude,
    };
    
    this.map = new google.maps.Map(mapDiv, {
      center,
      zoom: 13,
      mapTypeId: 'roadmap',
    });
    
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#007bff',
        strokeWeight: 5,
      },
    });
    this.directionsRenderer.setMap(this.map);
    
    this.tracarRota();
  }
  
  private tracarRota(): void {
    if (!this.rota || this.rota.stops.length < 2) return;
    
    const origin = {
      lat: this.rota.stops[0].latitude,
      lng: this.rota.stops[0].longitude,
    };
    
    const destination = {
      lat: this.rota.stops[this.rota.stops.length - 1].latitude,
      lng: this.rota.stops[this.rota.stops.length - 1].longitude,
    };
    
    const waypoints = this.rota.stops.slice(1, -1).map((stop) => ({
      location: { lat: stop.latitude, lng: stop.longitude },
      stopover: true,
    }));
    
    this.directionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: string) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
        } else {
          console.error('Falha ao traçar rota:', status);
        }
      }
    );
  }
}