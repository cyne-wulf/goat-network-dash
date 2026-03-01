import { z } from "zod";

export const InvoiceSchema = z.object({
  id: z.string(),
  amount: z.object({
    currency: z.string(),
    value: z.string(),
  }),
  instructions: z.object({
    payer: z.string(),
    receiver: z.string(),
    chain: z.string(),
    memo: z.string().optional(),
  }),
  createdAt: z.string(),
  expiresAt: z.string().optional(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;

export const PaymentActionSchema = z.object({
  invoiceId: z.string(),
  action: z.literal("pay"),
  attempt: z.number().int().min(1).max(5).optional(),
});

export type PaymentAction = z.infer<typeof PaymentActionSchema>;

export const ProofRecordSchema = z.object({
  invoiceId: z.string(),
  txHash: z.string(),
  explorerUrl: z.string().url(),
  settledAt: z.string(),
});

export type ProofRecord = z.infer<typeof ProofRecordSchema>;

export const HelloGoatResponseSchema = z.object({
  message: z.string(),
  receipt: z.object({
    invoiceId: z.string(),
    paidAt: z.string(),
  }),
  proof: ProofRecordSchema,
});

export type HelloGoatResponse = z.infer<typeof HelloGoatResponseSchema>;

export const LogDirectionSchema = z.enum(["client", "server"]);
export type LogDirection = z.infer<typeof LogDirectionSchema>;

export const LogTypeSchema = z.enum(["request", "challenge", "payment", "success", "error"]);
export type LogType = z.infer<typeof LogTypeSchema>;

export const LogEntrySchema = z.object({
  id: z.string(),
  level: z.enum(["info", "error"]),
  event: z.string(),
  type: LogTypeSchema,
  direction: LogDirectionSchema,
  timestamp: z.string(),
  statusCode: z.number().int().optional(),
  attempt: z.number().int().optional(),
  errorCode: z.string().optional(),
  payload: z.record(z.any()).optional(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;
