'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Structure } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface GraphViewProps {
  structure: Structure;
}

interface GraphData {
  nodes: string[];
  edges: [string, string][];
  directed?: boolean;
}

interface NodePosition {
  x: number;
  y: number;
}

export function GraphView({ structure }: GraphViewProps) {
  const data = structure.data as GraphData;
  const highlights = new Set(structure.highlights ?? []);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Empty graph
      </div>
    );
  }

  const { nodes, edges, directed } = data;

  // Calculate node positions in a circle
  const positions = useMemo(() => {
    const pos: Record<string, NodePosition> = {};
    const centerX = 150;
    const centerY = 100;
    const radius = Math.min(80, 40 + nodes.length * 5);

    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      pos[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return pos;
  }, [nodes]);

  return (
    <svg width="300" height="200" className="overflow-visible">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="4"
          refX="5"
          refY="2"
          orient="auto"
        >
          <polygon
            points="0 0, 6 2, 0 4"
            className="fill-muted-foreground"
          />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map(([from, to], i) => {
        const fromPos = positions[from];
        const toPos = positions[to];
        if (!fromPos || !toPos) return null;

        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 20;

        const startX = fromPos.x + (dx / len) * nodeRadius;
        const startY = fromPos.y + (dy / len) * nodeRadius;
        const endX = toPos.x - (dx / len) * (nodeRadius + (directed ? 6 : 0));
        const endY = toPos.y - (dy / len) * (nodeRadius + (directed ? 6 : 0));

        return (
          <motion.line
            key={`${from}-${to}-${i}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            className="stroke-muted-foreground"
            strokeWidth={2}
            markerEnd={directed ? 'url(#arrowhead)' : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const pos = positions[node];
        const isHighlighted = highlights.has(i);

        return (
          <motion.g
            key={node}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={20}
              className={cn(
                'stroke-2',
                isHighlighted
                  ? 'fill-primary stroke-primary'
                  : 'fill-card stroke-border'
              )}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className={cn(
                'text-sm font-mono',
                isHighlighted ? 'fill-primary-foreground' : 'fill-foreground'
              )}
            >
              {node}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
