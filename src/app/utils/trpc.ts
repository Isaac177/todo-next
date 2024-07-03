import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '@/app/api/trpc/[trpc]';

export const trpc = createReactQueryHooks<AppRouter>();
