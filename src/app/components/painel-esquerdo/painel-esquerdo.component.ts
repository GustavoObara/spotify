import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faHome,
  faSearch,
  faGuitar,
  faMusic,
  faBarChart
} from '@fortawesome/free-solid-svg-icons';
import { IPlaylist } from 'src/app/Interfaces/IPlaylist';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-painel-esquerdo',
  templateUrl: './painel-esquerdo.component.html',
  styleUrls: ['./painel-esquerdo.component.scss'],
})
export class PainelEsquerdoComponent implements OnInit {
  menuSelecionado = 'Home';

  playlists: IPlaylist[] = [];

  // Icones
  homeIcone = faHome;
  pesquisarIcone = faSearch;
  artistasIcone = faGuitar;
  playlistIcone = faMusic;
  dashboardIcone = faBarChart;

  constructor(private router: Router, private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.buscarPlaylists();
  }

  botaoClickHome(botao: string) {
    this.menuSelecionado = botao;
    this.router.navigateByUrl('player/home');
  }

  botaoClickArtistas(botao: string) {
    this.menuSelecionado = botao;
    this.buscarPlaylists();
    this.router.navigateByUrl('player/artistas');
  }

  botaoClickDashboard(botao: string) {
    this.menuSelecionado = botao;
    this.router.navigateByUrl('player/dashboard');
  }

  async buscarPlaylists() {
    this.playlists = await this.spotifyService.buscarPlaylistUsuario();
  }

  irParaPlaylist(playlistId) {
    this.menuSelecionado = playlistId;
    this.router.navigateByUrl(`player/lista/playlist/${playlistId}`);
  }
}
