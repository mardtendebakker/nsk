import { Subject, TextOrHtml } from "./types";

export type EmailTemplateDto = {
  name: string,
} & Subject & TextOrHtml;
