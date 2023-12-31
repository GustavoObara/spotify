import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Spotify from 'spotify-web-api-js';
import { SpotifyConfiguration } from 'src/environments/environment';
import {
  SpotifyArtistaParaArtista,
  SpotifyPlaylistParaPlaylist,
  SpotifySingleArtistaParaArtista,
  SpotifySinglePlaylistParaPlaylist,
  SpotifyTrackParaMusica,
  SpotifyUserParaUsuario,
  SpotifyUserParaUsuarioDetalhado,
} from '../Common/spotifyHelper';
import { IPlaylist } from '../Interfaces/IPlaylist';
import { IUsuario } from '../Interfaces/IUsuario';
import { IArtista } from '../Interfaces/IArtista';
import { IMusica } from '../Interfaces/IMusica';
import { IUsuarioDetalhado } from '../Interfaces/IUsuarioDetalhado';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  spotifyApi: Spotify.SpotifyWebApiJs = null;
  usuario: IUsuario;
  usuarioDetalhado: IUsuarioDetalhado;

  constructor(private router: Router) {
    this.spotifyApi = new Spotify();
  }

  async inicializarUsuario() {
    if (!!this.usuario) return true;

    const token = localStorage.getItem('token');

    if (!token) return false;

    try {
      this.definirAccessToken(token);
      await this.obterSpotifyUsuario();
      await this.obterUsuarioDetalhado();
      return !!this.usuario;
    } catch (ex) {
      return false;
    }
  }

  async obterSpotifyUsuario() {
    const userInfo = await this.spotifyApi.getMe();
    this.usuario = SpotifyUserParaUsuario(userInfo);
  }
  
  async obterUsuarioDetalhado() {
    const userInfoDetalhado = await this.spotifyApi.getMe();
    this.usuarioDetalhado = SpotifyUserParaUsuarioDetalhado(userInfoDetalhado);
  }

  obterUrlLogin() {
    const authEndpoint = `${SpotifyConfiguration.authEndpoint}?`;
    const clientId = `client_id=${SpotifyConfiguration.clientId}&`;
    const redirectUrl = `redirect_uri=${SpotifyConfiguration.redirectUrl}&`;
    const scopes = `scope=${SpotifyConfiguration.scopes.join('%20')}&`;
    const responseType = `response_type=token&show_dialog=true`;
    return authEndpoint + clientId + redirectUrl + scopes + responseType;
  }

  obterTokenUrlCallback() {
    if (!window.location.hash) return '';

    const params = window.location.hash.substring(1).split('&');
    return params[0].split('=')[1];
  }

  definirAccessToken(token: string) {
    this.spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token);
  }

  async buscarPlaylistUsuario(offset = 0, limit = 50): Promise<IPlaylist[]> {
    const playlists = await this.spotifyApi.getUserPlaylists(this.usuario.id, {
      offset,
      limit,
    });
    return playlists.items.map(SpotifyPlaylistParaPlaylist);
  }

  async buscarMusicasPlaylist(playlistId: string, offset = 0, limit = 50) {
    const playlistSpotify = await this.spotifyApi.getPlaylist(playlistId);

    if (!playlistSpotify) return null;

    const playlist = SpotifySinglePlaylistParaPlaylist(playlistSpotify);

    const musicasSpotify = await this.spotifyApi.getPlaylistTracks(playlistId, {
      offset,
      limit,
    });
    playlist.musicas = musicasSpotify.items.map((musica) =>
      SpotifyTrackParaMusica(musica.track as SpotifyApi.TrackObjectFull)
    );

    return playlist;
  }

  async buscarMusicasArtista(artistaId: string, offset = 0, limit = 50) {
    const artistaSpotify = await this.spotifyApi.getArtist(artistaId);

    if (!artistaSpotify) return null;

    const artista = SpotifySingleArtistaParaArtista(artistaSpotify);

    const musicasSpotify = await this.spotifyApi.getArtistTopTracks(artistaId, 'BR');

    artista.musicas = musicasSpotify.tracks.map(musica => SpotifyTrackParaMusica(musica));

    return artista;
  }

  async buscarTopArtistas(limit = 10): Promise<IArtista[]> {
    const artistas = await this.spotifyApi.getMyTopArtists({ limit });
    return artistas.items.map(SpotifyArtistaParaArtista);
  }

  async buscarArtistasSeguidos(limit = 30): Promise<IArtista[]> {
    const artistas = await this.spotifyApi.getMyTopArtists({ limit });
    return artistas.items.map(SpotifyArtistaParaArtista);
  }

  async buscarMusicas(offset = 0, limit = 50): Promise<IMusica[]> {
    const musicas = await this.spotifyApi.getMySavedTracks({ offset, limit });
    return musicas.items.map((x) => SpotifyTrackParaMusica(x.track));
  }

  async obterMusicaAtual(): Promise<IMusica> {
    const musicaAtual = await this.spotifyApi.getMyCurrentPlayingTrack();
    return SpotifyTrackParaMusica(musicaAtual.item, musicaAtual.is_playing);
  }

  async executarMusica(musicaId: string) {
    await this.spotifyApi.queue(musicaId);
    await this.spotifyApi.skipToNext();
  }

  async voltarMusica() {
    this.spotifyApi.skipToPrevious();
  }
  async avancarMusica() {
    this.spotifyApi.skipToNext();
  }
  async playAndPause() {
    if ((await this.spotifyApi.getMyCurrentPlayingTrack()).is_playing)
      this.spotifyApi.pause();
    else this.spotifyApi.play();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
