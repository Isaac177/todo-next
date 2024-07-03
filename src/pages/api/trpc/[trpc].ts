import { initTRPC } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import superjson from 'superjson';
import { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextApiRequest } from 'next';

const prisma = new PrismaClient();

const t = initTRPC.context<{
    req: NextApiRequest;
}>().create({
    transformer: superjson,
});

const uploadDir = path.join(process.cwd(), '/public/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const saveFile = async (file: any) => {
    const data = fs.readFileSync(file.filepath);
    const filePath = path.join(uploadDir, file.newFilename);
    fs.writeFileSync(filePath, data);
    fs.unlinkSync(file.filepath);
    return `/uploads/${file.newFilename}`;
};

export const appRouter = t.router({
    getAllPosts: t.procedure.query(async () => {
        return prisma.post.findMany();
    }),
    createPost: t.procedure
        .input(z.object({
            title: z.string(),
            content: z.string(),
            imageUrl: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            return prisma.post.create({ data: input });
        }),
    uploadImage: t.procedure
        .input(z.object({ formData: z.any() }))
        .mutation(async ({ input, ctx }) => {
            const form = new IncomingForm({
                uploadDir,
                keepExtensions: true,
            });

            return new Promise<{ imageUrl: string }>((resolve, reject) => {
                form.parse(ctx.req, async (err: Error, fields: Fields, files: Files) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const file = files.image;
                    const imageUrl = await saveFile(file);
                    resolve({ imageUrl });
                });
            });
        }),
    getPostById: t.procedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            return prisma.post.findUnique({ where: { id: input.id } });
        }),
    updatePost: t.procedure
        .input(z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            imageUrl: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            return prisma.post.update({
                where: { id: input.id },
                data: {
                    title: input.title,
                    content: input.content,
                    imageUrl: input.imageUrl,
                },
            });
        }),

    deletePost: t.procedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            return prisma.post.delete({ where: { id: input.id } });
        }),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: ({ req }) => ({ req }),
    async onError({ error, path }) {
        console.error(`Error on ${path}:`, error);
    },
});
