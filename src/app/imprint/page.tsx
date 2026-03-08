import { getContent } from "@/content";
import { ImprintPage } from "../ImprintPage";

export default function Imprint() {
  return <ImprintPage t={getContent("de")} />;
}
