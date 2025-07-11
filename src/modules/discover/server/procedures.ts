import { db } from "@/db";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { discover } from "@/db/schema";
import { TRPCError } from "@trpc/server";

export const discoverRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        try {
            // Check if db is defined
            if (!db) {
                throw new Error("Database connection not available");
            }
            
            const data = await db 
                .select()
                .from(discover);
            return data;
        } catch (error) {
            console.error("Database connection error:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch creators. Please try again later.",
                cause: error
            });
        }
    }),
});
