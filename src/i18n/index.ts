import { fr } from "./fr";
import { ar } from "./ar";

export type TranslationKeys = typeof fr;

const translations = { fr, ar } as const;

export default translations;
