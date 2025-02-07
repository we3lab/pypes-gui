import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '@/server/api/root';

function getBaseUrl() {
  const cloudFrontend = process.env.NEXT_PUBLIC_HOST
  const localFrontend = `http://localhost:${process.env.PORT ?? 3000}`;
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';
  console.log("Host", process.env.NODE_ENV === 'development' ? localFrontend : cloudFrontend)
  return process.env.NODE_ENV === 'development' ? localFrontend : cloudFrontend;
}


export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
