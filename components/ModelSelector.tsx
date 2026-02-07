"use client";

import { ModelTier, MODEL_CONFIG } from "@/lib/ai";

interface ModelSelectorProps {
  selectedModel: ModelTier;
  onSelectModel: (model: ModelTier) => void;
  remainingUses: Record<ModelTier, number>;
}

const MODEL_TIERS: ModelTier[] = ["flash", "pro", "deep-search"];

const MODEL_COLORS: Record<ModelTier, { bg: string; text: string; ring: string }> = {
  flash: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-300",
    ring: "ring-yellow-500",
  },
  pro: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    ring: "ring-purple-500",
  },
  "deep-search": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-500",
  },
};

export default function ModelSelector({
  selectedModel,
  onSelectModel,
  remainingUses,
}: ModelSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {MODEL_TIERS.map((tier) => {
        const config = MODEL_CONFIG[tier];
        const colors = MODEL_COLORS[tier];
        const remaining = remainingUses[tier];
        const isSelected = selectedModel === tier;
        const isDisabled = remaining <= 0;

        return (
          <button
            key={tier}
            onClick={() => !isDisabled && onSelectModel(tier)}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? `${colors.bg} ${colors.text} ring-2 ${colors.ring}`
                : isDisabled
                ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : `hover:${colors.bg} text-gray-600 dark:text-gray-400 hover:${colors.text}`
            }`}
          >
            <span>{config.name}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                isDisabled
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-white/60 dark:bg-black/20"
              }`}
            >
              {remaining}/{config.dailyLimit}
            </span>
          </button>
        );
      })}
    </div>
  );
}
