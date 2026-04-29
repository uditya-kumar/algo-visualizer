'use client';

import { motion } from 'framer-motion';
import { Structure } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface VariableViewProps {
  structure: Structure;
}

export function VariableView({ structure }: VariableViewProps) {
  const isHighlighted = structure.highlights && structure.highlights.length > 0;

  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded border font-mono',
        isHighlighted
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card border-border'
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-sm">{formatValue(structure.data)}</span>
    </motion.div>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (Array.isArray(value)) return `[${value.join(', ')}]`;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
