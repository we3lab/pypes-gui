import { authOptions } from '@/server/api/auth';
import NextAuth from 'next-auth';

// const handler = NextAuth(authOptions);
// export {handler as GET, handler as POST};

// export default NextAuth(authOptions);
const authHandler = NextAuth(authOptions);
// export defau {authHandler as GET, authHandler as POST};
 export default async function handler(...params: any[]) {
   await authHandler(...params);
 }
