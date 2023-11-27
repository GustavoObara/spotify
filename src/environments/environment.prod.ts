export const environment = {
  production: true
};

export const SpotifyConfiguration = {
  authEndpoint: 'https://accounts.spotify.com/authorize',
  clientId: '78f2a7ead8ee4f479030da84e3111394', //Meu
  // clientId: 'e61824a2a6f845008eda73ac7fa72672', // Amanda
  redirectUrl: 'http://localhost:4200/login/',
  scopes: [
    "user-read-currently-playing", // musica tocando agora.
    "user-read-recently-played", // ler musicas tocadas recentemente
    "user-read-playback-state", // ler estado do player do usuario
    "user-top-read", // top artistas e musicas do usuario
    "user-modify-playback-state", // alterar do player do usuario.
    "user-library-read", // ler biblioteca dos usuarios
    "playlist-read-private", // ler playlists privads
    "playlist-read-collaborative" // ler playlists colaborativas
  ]
}
