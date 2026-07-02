import prisma from "../config/prisma";

export async function getCallerById(callerId: number) {
  const caller = await prisma.caller.findUnique({
    where: {
      id: callerId,
    },
  });

  if (!caller) {
    throw new Error("Caller not found");
  }

  return caller;
}