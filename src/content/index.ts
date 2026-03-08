import { en } from "./en";
import { de } from "./de";

export const locales = ["de", "en"] as const;
export const defaultLocale = "de";
export type Locale = (typeof locales)[number];

const content = { en, de } as const;

export function getContent(locale: string) {
  return content[locale as Locale] ?? content.de;
}
