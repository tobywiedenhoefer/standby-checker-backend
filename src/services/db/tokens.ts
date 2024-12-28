import db from "@/db/db";
import { InsertToken, tokens } from "@/db/schema";
import { getUnexpiredTokensByUserId } from "@/db/queries";

type GetToken = {
  userId: string;
  token?: string;
};
export const get = async (params: GetToken): Promise<string[]> => {
  if (!params.token) {
    return [];
  }
  const query = await getUnexpiredTokensByUserId();
  const tokens = await query.execute({
    userId: params.userId,
  });
  const unexpiredTokens: string[] = [];
  tokens.forEach((token) => {
    if (unexpiredTokens.length == 0 && token.id === params.token) {
      unexpiredTokens.push(token.id);
    }
  });
  return unexpiredTokens;
};

export const post = async (params: InsertToken) => {
  return await db
    .insert(tokens)
    .values({ user_id: params.user_id })
    .returning({ id: tokens.id });
};
