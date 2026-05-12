import type { PrismaClient } from '@prisma/client'

export default {
  datasourceUrl: process.env.DATABASE_URL,
} satisfies PrismaClient.PrismaConfigOptions
