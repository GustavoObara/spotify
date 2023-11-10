import { Component, OnInit } from '@angular/core';
import { newArtista } from 'src/app/Common/factories';
import { IArtista } from 'src/app/Interfaces/IArtista';
import { IMusica } from 'src/app/Interfaces/IMusica';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-top-artista',
  templateUrl: './top-artista.component.html',
  styleUrls: ['./top-artista.component.scss']
})
export class TopArtistaComponent implements OnInit {

  topArtista: IArtista = newArtista();

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.buscarArtista();
  }

  async buscarArtista(){
    const artistas = await this.spotifyService.buscarTopArtistas(1);
    if(!!artistas)
      this.topArtista = artistas.pop();
  }

  async playTopArtista(artista: IArtista){
    const artistaMusica: any = await this.spotifyService.buscarMusicasArtista(artista.id);
    if (artistaMusica.musicas && artistaMusica.musicas.length > 0) {
        const musica: IMusica = artistaMusica.musicas[0];
        await this.spotifyService.executarMusica(musica.id);
    } else {
        console.error('A lista de músicas está vazia ou indefinida.');
    }
  }

}