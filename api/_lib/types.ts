/**
 * Minimal request/response types for Vercel serverless functions.
 * Avoids the @vercel/node dependency which crashes at runtime.
 */
export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: any;
  query: Record<string, string | string[]>;
  url?: string;
  on(event: string, listener: (...args: any[]) => void): any;
}

export interface VercelResponse {
  status(code: number): VercelResponse;
  json(data: any): void;
  send(data: any): void;
  end(): void;
  setHeader(name: string, value: string): void;
  redirect(url: string): void;
}
