'use client';

import { motion } from 'framer-motion';
import { Structure, getArrayCells, isInRange } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface ArrayViewProps {
  structure: Structure;
}

export function ArrayView({ structure }: ArrayViewProps) {
  const cells = getArrayCells(structure);

  if (cells.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Empty array
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {cells.map((cell, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.02 }}
        >
          {cell.pointer && cell.pointer.length > 0 && (
            <div className="flex gap-0.5 mb-1">
              {cell.pointer.map((p) => (
                <span
                  key={p}
                  className="text-xs font-mono text-primary bg-primary/10 px-1 rounded"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
          {!cell.pointer && <div className="h-5 mb-1" />}

          <div
            className={cn(
              'w-10 h-10 flex items-center justify-center border rounded font-mono text-sm transition-colors',
              cell.highlighted
                ? 'bg-primary text-white border-primary'
                : isInRange(structure, index)
                ? 'bg-primary/20 border-primary/50 text-foreground'
                : 'bg-card border-border text-foreground'
            )}
          >
            {formatValue(cell.value)}
          </div>

          <span className="text-xs text-muted-foreground mt-1">{index}</span>
        </motion.div>
      ))}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'T' : 'F';
  if (typeof value === 'string') return value.length > 4 ? value.slice(0, 3) + '…' : value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return '[…]';
  return String(value);
}
