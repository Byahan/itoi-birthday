import { getActiveStream } from "@/lib/streaming";
import LiveStatusContent from "./LiveStatusContent";

export default async function LiveStatus() {
  const activeStream = await getActiveStream();

  return <LiveStatusContent activeStream={activeStream} />;
}