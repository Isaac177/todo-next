import { initTRPC } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import superjson from 'superjson';

const prisma = new PrismaClient();

const t = initTRPC.create({
    transformer: superjson,
});

export const appRouter = t.router({
    getAllPosts: t.procedure
        .query(async () => {
            return prisma.post.findMany();
        }),
    createPost: t.procedure
        .input(z.object({
            title: z.string(),
            content: z.string(),
        }))
        .mutation(async ({ input }) => {
            return prisma.post.create({ data: input });
        }),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: () => ({}),
    //transformer: superjson,
});
