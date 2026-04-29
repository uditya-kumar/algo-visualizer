'use client';

import { useMemo } from 'react';
import { Structure, buildPointerMap } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface LinkedListViewProps {
  structure: Structure;
}

interface LinkedListData {
  nodes: (string | number | null)[];
  cycleIndex?: number;
}

const NODE_WIDTH = 56;
const NODE_HEIGHT = 48;
const ARROW_LENGTH = 40;
const PADDING_TOP = 28;

export function LinkedListView({ structure }: LinkedListViewProps) {
  const highlights = new Set(structure.highlights ?? []);
  const pointerMap = buildPointerMap(structure.pointers);

  const { nodes, cycleIndex } = useMemo(() => {
    const data = structure.data;

    if (Array.isArray(data)) {
      return { nodes: data, cycleIndex: undefined };
    }

    if (data && typeof data === 'object' && 'nodes' in data) {
      const listData = data as LinkedListData;
      return {
        nodes: listData.nodes,
        cycleIndex: listData.cycleIndex
      };
    }

    return { nodes: [], cycleIndex: undefined };
  }, [structure.data]);

  if (nodes.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Empty linked list
      </div>
    );
  }

  const hasCycle = cycleIndex !== undefined && cycleIndex >= 0 && cycleIndex < nodes.length;
  const totalWidth = nodes.length * (NODE_WIDTH + ARROW_LENGTH) + (hasCycle ? 40 : 60);
  const totalHeight = hasCycle ? NODE_HEIGHT + PADDING_TOP + 50 : NODE_HEIGHT + PADDING_TOP + 10;

  // Calculate positions
  const getNodeX = (index: number) => index * (NODE_WIDTH + ARROW_LENGTH);
  const nodeY = PADDING_TOP;

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      className="overflow-visible"
    >
      <defs>
        <marker
          id="ll-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#888" />
        </marker>
        <marker
          id="ll-arrow-up"
          markerWidth="8"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="270"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#888" />
        </marker>
      </defs>

      {/* Render nodes and forward arrows */}
      {nodes.map((value, index) => {
        const isHighlighted = highlights.has(index);
        const pointers = pointerMap[index];
        const isLastNode = index === nodes.length - 1;
        const isNull = value === null;
        const x = getNodeX(index);

        return (
          <g key={index}>
            {/* Pointer labels above node */}
            {pointers && pointers.length > 0 && (
              <text
                x={x + NODE_WIDTH / 2}
                y={nodeY - 10}
                textAnchor="middle"
                fontSize="12"
                fontFamily="monospace"
                fill="#3b82f6"
              >
                {pointers.join(', ')}
              </text>
            )}

            {/* Node box */}
            <rect
              x={x}
              y={nodeY}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={6}
              ry={6}
              fill={isNull ? '#f5f5f5' : isHighlighted ? '#18181b' : '#ffffff'}
              stroke={isNull ? '#ccc' : isHighlighted ? '#18181b' : '#d4d4d8'}
              strokeWidth={2}
              strokeDasharray={isNull ? '4 4' : undefined}
            />

            {/* Node value */}
            <text
              x={x + NODE_WIDTH / 2}
              y={nodeY + NODE_HEIGHT / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
              fontFamily="monospace"
              fill={isNull ? '#999' : isHighlighted ? '#ffffff' : '#18181b'}
            >
              {isNull ? 'null' : formatValue(value)}
            </text>

            {/* Forward arrow */}
            {!isNull && !isLastNode && (
              <line
                x1={x + NODE_WIDTH}
                y1={nodeY + NODE_HEIGHT / 2}
                x2={x + NODE_WIDTH + ARROW_LENGTH - 8}
                y2={nodeY + NODE_HEIGHT / 2}
                stroke="#888"
                strokeWidth={2}
                markerEnd="url(#ll-arrow)"
              />
            )}

            {/* Last node: arrow to None (only if no cycle) */}
            {!isNull && isLastNode && !hasCycle && (
              <>
                <line
                  x1={x + NODE_WIDTH}
                  y1={nodeY + NODE_HEIGHT / 2}
                  x2={x + NODE_WIDTH + ARROW_LENGTH - 8}
                  y2={nodeY + NODE_HEIGHT / 2}
                  stroke="#888"
                  strokeWidth={2}
                  markerEnd="url(#ll-arrow)"
                />
                <text
                  x={x + NODE_WIDTH + ARROW_LENGTH + 4}
                  y={nodeY + NODE_HEIGHT / 2}
                  dominantBaseline="central"
                  fontSize="14"
                  fontFamily="monospace"
                  fill="#888"
                >
                  None
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Cycle path: right, down, left along bottom, up to target */}
      {hasCycle && (() => {
        const lastIndex = nodes.length - 1;
        const startX = getNodeX(lastIndex) + NODE_WIDTH;
        const startY = nodeY + NODE_HEIGHT / 2;

        const targetX = getNodeX(cycleIndex) + NODE_WIDTH / 2;
        const targetY = nodeY + NODE_HEIGHT;

        const rightX = startX + 25;
        const bottomY = nodeY + NODE_HEIGHT + 35;
        const r = 10; // corner radius

        // Path: right from last node → down → left along bottom → up to target bottom
        const path = `
          M ${startX} ${startY}
          L ${rightX - r} ${startY}
          Q ${rightX} ${startY} ${rightX} ${startY + r}
          L ${rightX} ${bottomY - r}
          Q ${rightX} ${bottomY} ${rightX - r} ${bottomY}
          L ${targetX + r} ${bottomY}
          Q ${targetX} ${bottomY} ${targetX} ${bottomY - r}
          L ${targetX} ${targetY + 8}
        `;

        return (
          <path
            d={path}
            fill="none"
            stroke="#888"
            strokeWidth={2}
            markerEnd="url(#ll-arrow-up)"
          />
        );
      })()}
    </svg>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return '—';
  if (typeof value === 'string') return value.length > 4 ? value.slice(0, 3) + '…' : value;
  return String(value);
}
