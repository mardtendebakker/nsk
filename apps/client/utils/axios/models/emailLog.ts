export interface EmailLog {
  id: number,
  from: string,
  to: string,
  subject: string,
  content: string,
  api_error?: string,
  successful: boolean,
  created_at: string,
  updated_at: string,
}
