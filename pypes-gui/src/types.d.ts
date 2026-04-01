import 'next-auth'

declare module 'next-auth' {
  export interface User {
    access_token?: string;
  }

  export interface Session {
    user: {
    } & DefaultSession["user"]
  }
}