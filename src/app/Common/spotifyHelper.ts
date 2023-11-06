import { addMilliseconds, format } from "date-fns";
import { IPlaylist } from '../Interfaces/IPlaylist';
import { IUsuario } from '../Interfaces/IUsuario';
import { IArtista } from '../Interfaces/IArtista';
import { IMusica } from '../Interfaces/IMusica';
import { newArtista, newMusica, newPlaylist } from "./factories";

export function SpotifyUserParaUsuario(user: SpotifyApi.CurrentUsersProfileResponse): IUsuario {
    return {
        id: user.id,
        nome: user.display_name,
        imagemUrl: user.images.pop().url
    }
}

// export function SpotifyPlaylistParaPlaylist(playlist: SpotifyApi.PlaylistObjectSimplified): IPlaylist {
//     return {
//         id: playlist.id,
//         nome: playlist.name,
//         imagemUrl: playlist.images.pop().url
//     }
// }

export function SpotifyPlaylistParaPlaylist(playlist: SpotifyApi.PlaylistObjectSimplified): IPlaylist {
    if (!playlist || !playlist.images || playlist.images.length === 0) {
        return newPlaylist();
    }

    return {
        id: playlist.id,
        nome: playlist.name,
        imagemUrl: playlist.images[0].url // Use o primeiro elemento do array, em vez de usar pop()
    };
}

export function SpotifySinglePlaylistParaPlaylist(playlist: SpotifyApi.SinglePlaylistResponse): IPlaylist {
    if(!playlist)
        return newPlaylist();

    return {
        id: playlist.id,
        nome: playlist.name,
        imagemUrl: playlist.images.shift().url,
        musicas: []
    }
}

export function SpotifyArtistaParaArtista(spotifyArtista: SpotifyApi.ArtistObjectFull) : IArtista {
    return {
        id: spotifyArtista.id,
        imagemUrl: spotifyArtista.images.sort((a, b) => a.width - b.width).pop().url,
        nome: spotifyArtista.name
    };
}
export function SpotifySingleArtistaParaArtista(spotifyArtista: SpotifyApi.SingleArtistResponse): IArtista {
    if(!spotifyArtista)
        return newArtista();

    return {
        id: spotifyArtista.id,
        nome: spotifyArtista.name,
        imagemUrl: spotifyArtista.images.sort((a, b) => a.width - b.width).pop().url,
        musicas: []
    }
}

export function SpotifyTrackParaMusica(spotifyTrack: SpotifyApi.TrackObjectFull, playing?: boolean) : IMusica {
    
    if(!spotifyTrack)
        return newMusica()

    const msParaMinutos = (ms: number) => {
        const data= addMilliseconds(new Date(0), ms);
        return format(data, 'mm:ss');
    }
    
    return {
        id: spotifyTrack.uri,
        titulo: spotifyTrack.name,
        album: {
            id: spotifyTrack.album.id,
            imagemUrl: spotifyTrack.album.images.shift().url,
            nome: spotifyTrack.album.name
        },
        artistas: spotifyTrack.artists.map(artista => ({
            id: artista.id,
            nome: artista.name
        })),
        tempo: msParaMinutos(spotifyTrack.duration_ms),
        isPlaying: playing
    }
}