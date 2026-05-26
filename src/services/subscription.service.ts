import { getSupabase, useMock } from "./base.service";

export async function upgradeSubscription(userId: string, tier: "gold" | "platinum"): Promise<void> {
  if (useMock()) return;
  const cost = tier === "gold" ? 100 : 200;
  const { data: profile } = await getSupabase().from("profiles").select("credits").eq("id", userId).single();
  if (!profile || (profile.credits || 0) < cost) throw new Error("Insufficient credits");
  await getSupabase().from("profiles").update({ tier, credits: (profile.credits || 0) - cost }).eq("id", userId);
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  if (useMock()) return;
  await getSupabase().rpc("add_credits", { user_id: userId, amount });
}

export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  if (useMock()) return true;
  const { data: profile } = await getSupabase().from("profiles").select("credits").eq("id", userId).single();
  if (!profile || (profile.credits || 0) < amount) return false;
  await getSupabase().from("profiles").update({ credits: (profile.credits || 0) - amount }).eq("id", userId);
  return true;
}

export async function boostProfile(userId: string): Promise<boolean> {
  return deductCredits(userId, 20);
}
