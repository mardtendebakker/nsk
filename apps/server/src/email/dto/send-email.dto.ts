import { Subject, TextOrHtml } from './types';

export type SendEmailDto = {
  to: string[],
  from: string,
  log?: boolean
} & Subject & TextOrHtml;
