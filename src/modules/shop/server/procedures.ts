import { db } from "@/db";
import { shop } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

export const shopRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    if (!db) {
      throw new Error("Database connection is not available.");
    }
    const data = await db
    .select()
    .from(shop);
    
    return data;
  }),
});