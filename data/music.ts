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
  {
    id: "gyutto",
    title: "ぎゅっと",
    artist: "Itoi Toi",
    audio: "/audio/gyutto.mp3",
    cover: "/images/music/gyutto.jpg",
  },
  {
    id: "debiru",
    title: "デビルじゃないもん",
    artist: "Itoi Toi",
    audio: "/audio/debiru.mp3",
    cover: "/images/music/debiru.jpg",
  },
  {
    id: "snowhala",
    title: "Snow halation",
    artist: "Itoi Toi, Kohaku Teto, Hizuki Yui, Tentei Forte, Yozuna Niu",
    audio: "/audio/snowhala.mp3",
    cover: "/images/music/snowhala.jpg",
  },
  {
    id: "propose",
    title: "プロポーズ",
    artist: "Itoi Toi",
    audio: "/audio/propose.mp3",
    cover: "/images/music/propose.jpg",
  },
  {
    id: "lovecat",
    title: "愛猫",
    artist: "Itoi Toi",
    audio: "/audio/lovecat.mp3",
    cover: "/images/music/lovecat.jpg",
  },
];