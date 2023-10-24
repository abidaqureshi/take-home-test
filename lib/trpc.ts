import { type AppRouter } from '@/server/routers/_app';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

function getBaseUrl() {
	if (typeof window !== 'undefined')
		// browser should use relative path
		return '';

	if (process.env.VERCEL_URL)
		// reference for vercel.com
		return `https://${process.env.VERCEL_URL}`;

	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
	config(_opts) {
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
