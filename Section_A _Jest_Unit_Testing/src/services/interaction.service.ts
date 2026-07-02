export async function createInteraction(
  body: any,
  userId: number
) {
  return {
    id: 1,
    ...body,
    createdBy: userId,
  };
}