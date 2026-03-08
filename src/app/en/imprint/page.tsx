import { getContent } from "@/content";
import { ImprintPage } from "../../ImprintPage";

export default function ImprintEn() {
  return <ImprintPage t={getContent("en")} />;
}
