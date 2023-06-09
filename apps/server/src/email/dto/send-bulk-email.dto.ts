export type BulkEmailDto = {
  to: string[],
  from: string,
  template: string,
  data: string
};
