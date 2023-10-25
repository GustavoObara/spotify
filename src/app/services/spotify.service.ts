import { Injectable } from '@angular/core';
import {SpotifyConfiguration} from "../../environments/environment";
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../Interfaces/IUsuario';
import { IPlaylist } from '../Interfaces/IPlaylist';
import { SpotifyUserParaUsuario } from '../Common/spotifyHelper'
import { SpotifyPlaylistParaPlaylist } from '../Common/spotifyHelper'

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs = null;
  usuario: IUsuario;

  constructor() { 
    this.spotifyApi = new Spotify();
  }

  async inicializarUsuario() {
    if(!!this.usuario)
      return true;

    const token = localStorage.getItem('token');

    if(!token)
      return false

    try {
      
      this.definirAccessToken(token);
      await this.obterSpotifyUsuario();
      return !!this.usuario;

    } catch (ex) {
      return false;
    }
  }

  // async obterSpotifyUsuario() {
  //   const userInfo = await this.spotifyApi.getMe();
  //   this.usuario = SpotifyUserParaUsuario(userInfo);
  // }

  async obterSpotifyUsuario() {
    try {
      const userInfo = await this.spotifyApi.getMe();
      console.log('Resposta do Spotify API:', userInfo);
      this.usuario = SpotifyUserParaUsuario(userInfo);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }
  

  obterUrlLogin() {
    const authEndPoint = `${SpotifyConfiguration.authEndPoint}?`;
    const clientId = `client_id=${SpotifyConfiguration.clientId}&`;
    const scopes = `scope=${SpotifyConfiguration.scopes.join('%20')}&`;
    const redirectUrl = `redirect_uri=${SpotifyConfiguration.redirectUrl}&`;
    const responseType = `response_type=token&show_dialog=true`;
    return authEndPoint + clientId + redirectUrl + scopes + responseType;
  }

  obterTokenUrlCallback() {
    if (!window.location.hash) 
      return '';

    const params = window.location.hash.substring(1).split('&')
    return params[0].split('=')[1];
  }

  definirAccessToken(token: string) {
    this.spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token);
  }

  async buscarPlaylistUsuario(offset = 0, limit = 50): Promise<IPlaylist[]>{
    console.log(this.usuario);
    const playlists = await this.spotifyApi.getUserPlaylists(this.usuario.id, { offset, limit });
    console.log(playlists)
    return playlists.items.map(SpotifyPlaylistParaPlaylist);
  }
}
