import { db } from "@/db";
import { shop } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { z } from "zod";

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

  joinWaitlist: baseProcedure
    .input(z.object({
      email: z.string().email("Please enter a valid email address"),
    }))
    .mutation(async ({ input }) => {
      try {
        // Log the waitlist signup (you'll see this in your terminal/console)
        console.log('🎉 NEW WAITLIST SIGNUP:', {
          email: input.email,
          timestamp: new Date().toISOString(),
          message: 'Check your terminal for waitlist signups!'
        });

        // Email will be sent from client-side using EmailJS

        return { 
          success: true, 
          email: input.email,
          timestamp: new Date().toISOString(),
          message: "Thank you for joining our waitlist! We'll notify you when Zadulis Shop launches." 
        };
      } catch (error) {
        console.error('Error processing waitlist signup:', error);
        throw new Error('Failed to join waitlist. Please try again.');
      }
    }),
});