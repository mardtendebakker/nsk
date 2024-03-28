export type TextOrHtml = ({ text: string } & { html?: never }) | ({ text?: never } & { html: string });
export type Subject = { subject: string };
export type BulkTemplate = { name: string };
