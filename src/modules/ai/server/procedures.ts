import { db } from "@/db";
import { ai } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

export const aiRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        if (!db) {
            throw new Error("Database connection is not available.");
        }
        const data = await db
            .select()
            .from(ai);

        return data;
    }),
});