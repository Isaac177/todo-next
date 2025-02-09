// Path: src/app/utils/trpc/ts

import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import {AppRouter} from "@/pages/api/trpc/[trpc]";

export const trpc = createTRPCNext<AppRouter>({
    config() {
        return {
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                }),
            ],
            transformer: superjson,
        };
    },
    ssr: false,
});
