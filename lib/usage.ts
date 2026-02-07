import { supabase } from "./supabase";
import { MODEL_CONFIG, ModelTier } from "./ai";

export async function getUsageToday(
  userId: string,
  model: ModelTier
): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("model", model)
    .gte("used_at", today.toISOString());

  if (error) {
    console.error("Error fetching usage:", error);
    return 0;
  }

  return count || 0;
}

export async function getRemainingUses(
  userId: string,
  model: ModelTier
): Promise<number> {
  const used = await getUsageToday(userId, model);
  return Math.max(0, MODEL_CONFIG[model].dailyLimit - used);
}

export async function getAllRemainingUses(
  userId: string
): Promise<Record<ModelTier, number>> {
  const [flash, pro, deepSearch] = await Promise.all([
    getRemainingUses(userId, "flash"),
    getRemainingUses(userId, "pro"),
    getRemainingUses(userId, "deep-search"),
  ]);

  return {
    flash,
    pro,
    "deep-search": deepSearch,
  };
}

export async function logUsage(
  userId: string,
  model: ModelTier
): Promise<boolean> {
  const remaining = await getRemainingUses(userId, model);

  if (remaining <= 0) {
    return false;
  }

  const { error } = await supabase.from("usage_logs").insert({
    user_id: userId,
    model,
  });

  if (error) {
    console.error("Error logging usage:", error);
    return false;
  }

  return true;
}
