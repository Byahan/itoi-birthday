export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audio: string;
  cover: string;
}

export const musicTracks: MusicTrack[] = [
  {
    id: "mahouchoko",
    title: "魔法少女とチョコレゐト",
    artist: "Itoi Toi",
    audio: "/audio/mahouchoko.mp3",
    cover: "/images/music/mahouchoko.jpg",
  },
  {
    id: "daishikyu",
    title: "だいしきゅーだいしゅき",
    artist: "Itoi Toi",
    audio: "/audio/daishikyu.mp3",
    cover: "/images/music/daishikyu.jpg",
  },
  {
    id: "kyoofuku",
    title: "強風オールバック",
    artist: "Itoi Toi",
    audio: "/audio/kyoofuku.mp3",
    cover: "/images/music/kyoofuku.jpg",
  },
];