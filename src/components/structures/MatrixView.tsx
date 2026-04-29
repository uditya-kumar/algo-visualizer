'use client';

import { motion } from 'framer-motion';
import { Structure, buildPointerMap } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface MatrixViewProps {
  structure: Structure;
}

export function MatrixView({ structure }: MatrixViewProps) {
  const data = structure.data as unknown[][];
  const highlights = new Set(structure.highlights ?? []);
  const pointerMap = buildPointerMap(structure.pointers);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Empty matrix
      </div>
    );
  }

  // Flatten index calculation: row * cols + col
  const cols = data[0]?.length || 0;

  return (
    <div className="flex flex-col gap-0.5">
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-0.5">
          {Array.isArray(row) &&
            row.map((cell, colIndex) => {
              const flatIndex = rowIndex * cols + colIndex;
              const isHighlighted = highlights.has(flatIndex);
              const pointers = pointerMap[flatIndex];

              return (
                <motion.div
                  key={colIndex}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: flatIndex * 0.01,
                  }}
                >
                  {pointers && pointers.length > 0 && (
                    <div className="flex gap-0.5 mb-0.5">
                      {pointers.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] font-mono text-primary bg-primary/10 px-0.5 rounded"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className={cn(
                      'w-8 h-8 flex items-center justify-center border text-xs font-mono',
                      isHighlighted
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border'
                    )}
                  >
                    {formatValue(cell)}
                  </div>
                </motion.div>
              );
            })}
        </div>
      ))}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return '—';
  if (value === undefined) return '—';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'string') return value.length > 2 ? value.slice(0, 2) : value;
  return String(value);
}
