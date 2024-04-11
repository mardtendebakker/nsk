import { Subject, TextOrHtml } from './types';

export type SendEmailDto = {
  to: string[],
  from: string,
} & Subject & TextOrHtml;
