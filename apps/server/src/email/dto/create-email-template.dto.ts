import { Subject, BulkTemplate, TextOrHtml } from "./types";

export type EmailTemplateDto = BulkTemplate & Subject & TextOrHtml;
