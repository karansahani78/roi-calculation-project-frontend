interface AdSlotProps {
  slot: 'header' | 'sidebar' | 'below-results' | 'in-content';
  className?: string;
}

export function AdSlot({ slot, className = '' }: AdSlotProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-xs text-muted-foreground ${className}`}
      data-ad-slot={slot}
      aria-hidden="true"
    >
      <span className="py-3">Advertisement</span>
    </div>
  );
}
