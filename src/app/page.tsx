import { getContent } from "@/content";
import { HomePage } from "./HomePage";

export default function Home() {
  return <HomePage t={getContent("de")} />;
}
