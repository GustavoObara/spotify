import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/Interfaces/IMusica';
import { PlayerService } from 'src/app/services/player.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-lista-musicas',
  templateUrl: './lista-musicas.component.html',
  styleUrls: ['./lista-musicas.component.scss']
})
export class ListaMusicasComponent implements OnInit, OnDestroy {
  
  bannerImageUrl = '';
  bannerTexto = '';

  musicas: IMusica[] = [];
  musicaAtual: IMusica = newMusica();
  playIcone = faPlay

  title = '';

  subs: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private spotifyService: SpotifyService, 
    private playerService: PlayerService
    ) { }
  
  ngOnInit(): void {
    this.obterMusicas();
    this.obterMusicaAtual();
  }
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  obterMusicas() {
    const sub = this.activatedRoute.paramMap
    .subscribe(async params => {
        const tipo = params.get('tipo');
        const id = params.get('id');
        await this.obterDadosPagina(tipo, id);
    });
    this.subs.push(sub);
  }

  obterMusicaAtual() {
    const sub = this.playerService.musicaAtual.subscribe(musica => {
      this.musicaAtual = musica;
    });

    this.subs.push(sub);
  }

  async obterDadosPagina(tipo: string, id: string) {
    if(tipo === 'playlist')
      await this.obterDadosPlaylist(id);
    else  
      await this.obterDadosArtista(id);
  }

  async obterDadosPlaylist(playlistId: string) {
    const playlistMusicas = await this.spotifyService.buscarMusicasPlaylist(playlistId);
    this.definirPagina(playlistMusicas.nome, playlistMusicas.imagemUrl, playlistMusicas.musicas)
    this.title = "Musicas Playlist: " + playlistMusicas.nome;
  }
  async obterDadosArtista(artistaId: string) {
    const artistaMusicas = await this.spotifyService.buscarMusicasArtista(artistaId);
    this.definirPagina(artistaMusicas.nome, artistaMusicas.imagemUrl, artistaMusicas.musicas)
    this.title = "Musicas Artista: " + artistaMusicas.nome;
  }

  definirPagina(bannerText:string, bannerImage: string, musicas: IMusica[]){
    this.bannerImageUrl = bannerImage;
    this.bannerTexto = bannerText;
    this.musicas = musicas;
  }

  async executarMusica(musica: IMusica){
    await this.spotifyService.executarMusica(musica.id);
    this.playerService.definirMusicaAtual(musica);
  }

  obterArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.nome).join(', ');
  }
}
