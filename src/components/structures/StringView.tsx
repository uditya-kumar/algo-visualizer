'use client';

import { motion } from 'framer-motion';
import { Structure, getStringCells, isInRange } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface StringViewProps {
  structure: Structure;
}

export function StringView({ structure }: StringViewProps) {
  const cells = getStringCells(structure);

  if (cells.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Empty string
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-0.5">
      {cells.map((cell, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.015 }}
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
              'w-8 h-8 flex items-center justify-center border rounded font-mono text-sm transition-colors',
              cell.highlighted
                ? 'bg-primary text-white border-primary'
                : isInRange(structure, index)
                ? 'bg-primary/20 border-primary/50 text-foreground'
                : 'bg-card border-border text-foreground'
            )}
          >
            {String(cell.value)}
          </div>

          <span className="text-xs text-muted-foreground mt-1">{index}</span>
        </motion.div>
      ))}
    </div>
  );
}
