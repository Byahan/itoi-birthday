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

  text: `#ネオポルテ_ContreJour

年末ライブのキービジュアル公開されました！
どうですか？かわいいですか？
１２月２９日のライブで待ってるよ～～～✨

------------------------------------------------

◇特設サイト
https://event.neo-porte.jp/2026-event/contrejour/

◇チケット販売はこちら！（最速先行は23日23時59分まで）
 https://t.pia.jp/pia/event/event.do?eventBundleCd=b2671046

◇グッズ受注受付中（10月1日24時まで）
https://neoporte-webshop.com/collections/contre-jour-pre-sale`,

  date: "September 16, 2026",

  url: "https://x.com/itoitoi_Q/status/2100132582579204510",

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
      type: "image",
      src: "/images/pin-post2.jpg",
    },
  ],
};