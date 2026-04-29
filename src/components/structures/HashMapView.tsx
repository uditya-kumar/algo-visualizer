'use client';

import { motion } from 'framer-motion';
import { Structure } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface HashMapViewProps {
  structure: Structure;
}

export function HashMapView({ structure }: HashMapViewProps) {
  const data = structure.data as Record<string, unknown>;
  const entries = Object.entries(data || {});
  const highlights = new Set(structure.highlights ?? []);

  if (entries.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Empty hash map
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {entries.map(([key, value], index) => (
        <motion.div
          key={key}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded border font-mono text-sm',
            highlights.has(index)
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border'
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <span className="font-semibold">{formatValue(key)}</span>
          <span className="text-muted-foreground">→</span>
          <span>{formatValue(value)}</span>
        </motion.div>
      ))}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) return `[${value.join(', ')}]`;
  return JSON.stringify(value);
}
