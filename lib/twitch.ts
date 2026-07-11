import type { TwitchLiveStream } from "@/types/twitch";

interface TwitchTokenResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

interface TwitchStreamResponse {
  data?: Array<{
    id: string;
    user_login: string;
    user_name: string;
    game_name: string;
    title: string;
    viewer_count: number;
    started_at: string;
    thumbnail_url: string;
    type: "live" | "";
  }>;
}

async function getTwitchAppToken(): Promise<string | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET is missing.",
    );

    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?${params}`,
    {
      method: "POST",
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!response.ok) {
    console.error(
      "Twitch token request failed:",
      response.status,
      await response.text(),
    );

    return null;
  }

  const data = (await response.json()) as TwitchTokenResponse;

  return data.access_token ?? null;
}

export async function getTwitchLiveStream():
  Promise<TwitchLiveStream | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const username = process.env.TWITCH_USERNAME;

  if (!clientId || !username) {
    console.error(
      "TWITCH_CLIENT_ID or TWITCH_USERNAME is missing.",
    );

    return null;
  }

  try {
    const accessToken = await getTwitchAppToken();

    if (!accessToken) {
      return null;
    }

    const params = new URLSearchParams({
      user_login: username,
    });

    const response = await fetch(
      `https://api.twitch.tv/helix/streams?${params}`,
      {
        headers: {
          "Client-Id": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 120,
        },
      },
    );

    if (!response.ok) {
      console.error(
        "Twitch stream request failed:",
        response.status,
        await response.text(),
      );

      return null;
    }

    const data = (await response.json()) as TwitchStreamResponse;
    const stream = data.data?.[0];

    if (!stream || stream.type !== "live") {
      return null;
    }

    const thumbnail = stream.thumbnail_url
      .replace("{width}", "640")
      .replace("{height}", "360");

    return {
      platform: "twitch",
      id: stream.id,
      title: stream.title,
      username: stream.user_name,
      gameName: stream.game_name,
      viewerCount: stream.viewer_count,
      thumbnail,
      url: `https://www.twitch.tv/${stream.user_login}`,
      startedAt: stream.started_at,
    };
  } catch (error) {
    console.error("Unable to retrieve Twitch status:", error);
    return null;
  }
}