import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IArtista } from 'src/app/Interfaces/IArtista';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-top-artistas',
  templateUrl: './top-artistas.component.html',
  styleUrls: ['./top-artistas.component.scss']
})
export class TopArtistasComponent implements OnInit{

  artistas: IArtista[] = [];
  menuSelecionado = '';

  constructor(private router: Router, private spotifyService: SpotifyService){ }

  ngOnInit(): void {
    this.buscarTopArtistas();
  }

  async buscarTopArtistas() {
    this.artistas = await this.spotifyService.buscarTopArtistas(5);  
  }

  irParaArtista(artistaId) {
    this.menuSelecionado = artistaId;
    this.router.navigateByUrl(`player/lista/artista/${artistaId}`);
  }
}
'"'