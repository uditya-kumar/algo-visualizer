'use client';

import { useMemo } from 'react';
import { Structure } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface TreeViewProps {
  structure: Structure;
}

interface TreeNodeData {
  value: unknown;
  index: number;
  highlighted: boolean;
  isNull: boolean;
  x: number;
  y: number;
  parentIndex: number | null;
}

const NODE_RADIUS = 20;
const LEVEL_HEIGHT = 70;
const MIN_NODE_SPACING = 50;

export function TreeView({ structure }: TreeViewProps) {
  const data = structure.data as unknown[];
  const highlights = new Set(structure.highlights ?? []);

  const { nodes, width, height } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { nodes: [], width: 0, height: 0 };
    }

    const nodeList: TreeNodeData[] = [];

    // Calculate tree depth
    const depth = Math.floor(Math.log2(data.length)) + 1;
    const maxWidth = Math.pow(2, depth - 1) * MIN_NODE_SPACING;

    // Position nodes level by level
    let levelStart = 0;
    let levelSize = 1;
    let level = 0;

    while (levelStart < data.length) {
      const nodesInLevel = Math.min(levelSize, data.length - levelStart);
      const levelWidth = maxWidth / Math.pow(2, level);
      const startX = (maxWidth - (nodesInLevel - 1) * levelWidth) / 2;

      for (let i = 0; i < nodesInLevel; i++) {
        const index = levelStart + i;
        const value = data[index];
        const parentIndex = index === 0 ? null : Math.floor((index - 1) / 2);

        nodeList.push({
          value,
          index,
          highlighted: highlights.has(index),
          isNull: value === null,
          x: startX + i * levelWidth + NODE_RADIUS + 10,
          y: level * LEVEL_HEIGHT + NODE_RADIUS + 10,
          parentIndex,
        });
      }

      levelStart += levelSize;
      levelSize *= 2;
      level++;
    }

    return {
      nodes: nodeList,
      width: maxWidth + NODE_RADIUS * 2 + 20,
      height: level * LEVEL_HEIGHT + NODE_RADIUS + 20,
    };
  }, [data, highlights]);

  if (nodes.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Empty tree
      </div>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      style={{ minWidth: width, minHeight: height }}
    >
      {/* Draw edges first (behind nodes) */}
      {nodes.map((node) => {
        if (node.parentIndex === null || node.isNull) return null;
        const parent = nodes[node.parentIndex];
        if (!parent || parent.isNull) return null;

        return (
          <line
            key={`edge-${node.index}`}
            x1={parent.x}
            y1={parent.y + NODE_RADIUS}
            x2={node.x}
            y2={node.y - NODE_RADIUS}
            className="stroke-muted-foreground"
            strokeWidth={2}
          />
        );
      })}

      {/* Draw nodes */}
      {nodes.map((node) => (
        <g key={node.index}>
          <circle
            cx={node.x}
            cy={node.y}
            r={NODE_RADIUS}
            className={cn(
              'stroke-2',
              node.isNull
                ? 'fill-transparent stroke-muted-foreground/30 stroke-dashed'
                : node.highlighted
                ? 'fill-primary stroke-primary'
                : 'fill-card stroke-border'
            )}
            strokeDasharray={node.isNull ? '4 4' : undefined}
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="central"
            className={cn(
              'text-sm font-mono',
              node.isNull
                ? 'fill-muted-foreground/30'
                : node.highlighted
                ? 'fill-white'
                : 'fill-foreground'
            )}
          >
            {node.isNull ? '∅' : formatValue(node.value)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return '∅';
  if (value === undefined) return '—';
  if (typeof value === 'string') return value.length > 3 ? value.slice(0, 3) : value;
  return String(value);
}
