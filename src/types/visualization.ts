export interface AlgoTrace {
  title: string;
  input?: string;
  steps: Step[];
}

export interface Step {
  description: string;
  structures: Structure[];
}

export interface Structure {
  id: string;
  label: string;
  type: StructureType;
  data: unknown;
  highlights?: number[];
  pointers?: Record<string, number>;
  range?: [number, number];
}

export type StructureType =
  | 'array'
  | 'string'
  | 'matrix'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'tree'
  | 'graph'
  | 'hash-map'
  | 'variable'
  | 'recursion-tree'
  | 'heap'
  | 'intervals'
  | 'trie';

export interface Cell {
  value: unknown;
  highlighted: boolean;
  pointer?: string[];
}

export function buildPointerMap(pointers?: Record<string, number>): Record<number, string[]> {
  const map: Record<number, string[]> = {};
  if (pointers) {
    for (const [name, index] of Object.entries(pointers)) {
      if (!map[index]) map[index] = [];
      map[index].push(name);
    }
  }
  return map;
}

export function getArrayCells(structure: Structure): Cell[] {
  const data = structure.data;
  if (!Array.isArray(data)) return [];

  const highlights = new Set(structure.highlights ?? []);
  const pointerMap = buildPointerMap(structure.pointers);

  return data.map((value, index) => ({
    value,
    highlighted: highlights.has(index),
    pointer: pointerMap[index],
  }));
}

export function getStringCells(structure: Structure): Cell[] {
  let chars: string[];

  if (typeof structure.data === 'string') {
    chars = structure.data.split('');
  } else if (Array.isArray(structure.data)) {
    chars = structure.data.map(String);
  } else {
    return [];
  }

  const highlights = new Set(structure.highlights ?? []);
  const pointerMap = buildPointerMap(structure.pointers);

  return chars.map((value, index) => ({
    value,
    highlighted: highlights.has(index),
    pointer: pointerMap[index],
  }));
}

export function isInRange(structure: Structure, index: number): boolean {
  const range = structure.range;
  return range != null && index >= range[0] && index <= range[1];
}
