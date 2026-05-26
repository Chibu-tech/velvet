import { getSupabase, useMock, mockDelay } from "./base.service";

export async function generateReferralCode(userId: string): Promise<string> {
  if (useMock()) {
    return "VELVET-" + userId.slice(0, 4).toUpperCase();
  }
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const code = "VLT" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const { error } = await getSupabase().from("referral_codes").insert({ user_id: userId, code });
  if (error) throw error;
  return code;
}

export async function getReferralCode(userId: string): Promise<string | null> {
  if (useMock()) {
    return "VELVET-VIP";
  }
  const { data, error } = await getSupabase().from("referral_codes").select("code").eq("user_id", userId).maybeSingle();
  if (error || !data) return null;
  return data.code;
}

export async function redeemReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (useMock()) {
    return true;
  }
  const { data } = await getSupabase().from("referral_codes").select("id, user_id").eq("code", code).maybeSingle();
  if (!data) return false;
  await getSupabase().from("referral_codes").update({ reward_count: getSupabase().rpc("increment") as any }).eq("id", data.id);
  await addCredits(data.user_id, 10);
  await addCredits(newUserId, 5);
  return true;
}

async function addCredits(userId: string, amount: number): Promise<void> {
  try {
    await getSupabase().rpc("add_credits", { user_id: userId, amount });
  } catch {}
}
