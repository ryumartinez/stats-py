import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";


const chartDataItemSchema = z.object({
  date: z.date(),
  amount1: z.number(),
  amount2: z.number().nullable(),
});

export const chartRouter = createTRPCRouter({
  /**
   * READ: Get a single chart by its ID.
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.chart.findUnique({
        where: { id: input.id },
        include: {
          data: true,
        },
      });
    }),

  /**
   * READ: Get all charts.
   */
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.chart.findMany({
      include: {
        data: {
          orderBy: { date: "asc" }, // Order data points by date
        },
      },
    });
  }),

  /**
   * CREATE: Create a new chart with its data points.
   * Now a public procedure. It requires a `userId` in the input.
   */
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        amountUnit: z.string(),
        dateUnit: z.string(),
        data: z.array(chartDataItemSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chart.create({
        data: {
          name: input.name,
          amountUnit: input.amountUnit,
          dateUnit: input.dateUnit,
          data: {
            create: input.data.map((item) => ({
              date: item.date,
              amount1: new Prisma.Decimal(item.amount1),
              amount2: item.amount2? new Prisma.Decimal(item.amount2) : null,
            })),
          },
        },
      });
    }),

  /**
   * DELETE: Delete a chart by its ID.
   * Now a public procedure.
   */
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chart.delete({
        where: { id: input.id },
      });
    }),
});