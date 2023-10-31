import { Injectable } from '@angular/core';
import { IMusica } from '../Interfaces/IMusica';
import { newMusica } from '../Common/factories';
import { BehaviorSubject } from 'rxjs';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  musicaAtual = new BehaviorSubject<IMusica>(newMusica());
  timerId: any = null;

  constructor(private spotifyService: SpotifyService) { 
    this.obterMusicaAtual();
  }

  async obterMusicaAtual(){
    clearTimeout(this.timerId);
    
    const musica = await this.spotifyService.obterMusicaAtual();
    this.definirMusicaAtual(musica);

    this.timerId = setInterval(async () => {
      await this.obterMusicaAtual();
    }, 5000)
  }

  definirMusicaAtual(musica: IMusica){
    this.musicaAtual.next(musica);
  }

  async voltarMusica(){
    await this.spotifyService.voltarMusica();
    await this.obterMusicaAtual();
  }
  async avancarMusica(){
    await this.spotifyService.avancarMusica();
    await this.obterMusicaAtual();
  }
  async playAndPause(){
    await this.spotifyService.playAndPause();
  }
}
