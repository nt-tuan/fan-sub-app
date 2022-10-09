import languages from "@/lang/en/languages.json";
export const getLanguageName = (code?: string) =>
  (languages as Record<string, string>)[code ?? ""];
