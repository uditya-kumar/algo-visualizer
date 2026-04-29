'use client';

import { motion } from 'framer-motion';
import { Structure, getArrayCells } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface StackViewProps {
  structure: Structure;
}

export function StackView({ structure }: StackViewProps) {
  const cells = getArrayCells(structure);
  const isQueue = structure.type === 'queue';

  if (cells.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {isQueue ? 'back' : 'top'}
        </span>
        <div className="text-muted-foreground text-sm italic px-4 py-2 border border-dashed rounded">
          Empty {isQueue ? 'queue' : 'stack'}
        </div>
        <span className="text-xs text-muted-foreground">
          {isQueue ? 'front' : 'bottom'}
        </span>
      </div>
    );
  }

  const displayCells = isQueue ? cells : [...cells].reverse();

  return (
    <div className={cn('flex gap-2 items-center', isQueue ? 'flex-row' : 'flex-col')}>
      <span className="text-xs text-muted-foreground">
        {isQueue ? 'front' : 'top'}
      </span>

      <div className={cn('flex gap-1', isQueue ? 'flex-row' : 'flex-col')}>
        {displayCells.map((cell, displayIndex) => {
          const actualIndex = isQueue ? displayIndex : cells.length - 1 - displayIndex;
          return (
            <motion.div
              key={actualIndex}
              className={cn(
                'w-12 h-10 flex items-center justify-center border rounded font-mono text-sm',
                cell.highlighted
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border'
              )}
              initial={{ opacity: 0, x: isQueue ? -20 : 0, y: isQueue ? 0 : -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.2, delay: displayIndex * 0.05 }}
            >
              {formatValue(cell.value)}
            </motion.div>
          );
        })}
      </div>

      <span className="text-xs text-muted-foreground">
        {isQueue ? 'back' : 'bottom'}
      </span>
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return '—';
  if (typeof value === 'string') return value.length > 4 ? value.slice(0, 3) + '…' : value;
  return String(value);
}
