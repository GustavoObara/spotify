import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPause, faPlay, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/Interfaces/IMusica';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})

export class PlayerCardComponent implements OnInit, OnDestroy{

  musica: IMusica = newMusica();
  subs: Subscription[] = [];

  // Icones
  anteriorIcone = faStepBackward;
  proximoIcone = faStepForward;
  playIcone;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.obterMusicaAtual();
  }
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  obterArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.nome).join(', ');
  }

  obterMusicaAtual(){ 
    const sub = this.playerService.musicaAtual.subscribe(musica => {
      this.musica = musica;
      this.changeIcon();
    });
    this.subs.push(sub);
  }

  voltarMusica(){
    this.playerService.voltarMusica();
    this.obterMusicaAtual();
  }
  avancarMusica(){
    this.playerService.avancarMusica();
    this.obterMusicaAtual();
  }
  playAndPause(){
    this.playerService.playAndPause();
    this.obterMusicaAtual();
  }
  changeIcon(){
    if(this.musica.isPlaying)
      this.playIcone = faPause;
    else
      this.playIcone = faPlay;
  }
}
