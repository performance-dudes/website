import { getContent } from "@/content";
import { HomePage } from "../HomePage";

export default function HomeEn() {
  return <HomePage t={getContent("en")} />;
}
