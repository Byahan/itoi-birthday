export type PinnedPostMedia =
  | {
      type: "image";
      src: string;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
    };

type PinnedPostData = {
  displayName: string;
  username: string;
  profileImage: string;
  text: string;
  date: string;
  url: string;
  media: PinnedPostMedia[];
};

export const pinnedPost: PinnedPostData = {
  displayName: "絲依とい / いといとい🫖🐾",
  username: "@itoitoi_Q",
  profileImage: "/images/itoi-profile.jpg",

  text: `ロミオとシンデレラ🍎歌ってみた

Vocal:絲依とい     
Illust:KEMARI様      
Mix:はるっと様 
movi:白涙様

フルはこちら🌹
https://www.youtube.com/watch?v=wjKaBLq3h2I`,

  date: "August 1, 2026",

  url: "https://x.com/itoitoi_Q/status/2083513069498421298",

  media: [
    // {
    //   type: "image",
    //   src: "/images/pinned1.jpg",
    // },
    // {
    //   type: "image",
    //   src: "/images/pinned2.jpg",
    // },

    {
      type: "video",
      src: "/videos/pin-1aug.mp4",
      poster: "/images/pin-thumb.jpg",
    },
  ],
};