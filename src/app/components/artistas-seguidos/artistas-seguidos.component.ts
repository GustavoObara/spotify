import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IArtista } from 'src/app/Interfaces/IArtista';
import { SpotifyService } from 'src/app/services/spotify.service';


@Component({
  selector: 'app-artistas-seguidos',
  templateUrl: './artistas-seguidos.component.html',
  styleUrls: ['./artistas-seguidos.component.scss']
})
export class ArtistasSeguidosComponent {
  
  artistas: IArtista[] = [];
  menuSelecionado = '';
  
  constructor(private router: Router, private spotifyService: SpotifyService){ }
  
  ngOnInit(): void {
    this.buscarArtistasSeguidos();
  }
  
  async buscarArtistasSeguidos() {
    this.artistas = await this.spotifyService.buscarArtistasSeguidos();  
  }
  
  irParaArtista(artistaId) {
    this.menuSelecionado = artistaId;
    this.router.navigateByUrl(`player/lista/artista/${artistaId}`);
  }
}