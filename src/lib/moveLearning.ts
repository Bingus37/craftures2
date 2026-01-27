import type { CraftureType, OwnedCrafture } from '@/types/crafture';
import type { BattleMove } from '@/types/battle';
import { getMovesForType } from '@/types/battle';

// Simple learnset rule:
// - Each type has 4 moves in its pool
// - Craftures learn them at these levels (by pool order)
export const DEFAULT_MOVE_LEARN_LEVELS = [1, 4, 8, 12] as const;

export function getLearnedMoveIdsForLevel(type: CraftureType, level: number): string[] {
  const pool = getMovesForType(type);
  const learned: string[] = [];

  for (let i = 0; i < pool.length; i++) {
    const requiredLevel = DEFAULT_MOVE_LEARN_LEVELS[i] ?? DEFAULT_MOVE_LEARN_LEVELS[DEFAULT_MOVE_LEARN_LEVELS.length - 1];
    if (level >= requiredLevel) learned.push(pool[i].id);
  }

  // Always ensure at least one move (for safety with weird data)
  if (learned.length === 0 && pool[0]) learned.push(pool[0].id);
  return learned;
}

export function ensureLearnedMoveIds(
  type: CraftureType,
  level: number,
  existingIds: string[] = []
): string[] {
  const pool = getMovesForType(type);
  const allowed = new Set(pool.map((m) => m.id));
  const shouldKnow = getLearnedMoveIdsForLevel(type, level);

  const merged = new Set<string>([...existingIds, ...shouldKnow]);
  return Array.from(merged).filter((id) => allowed.has(id));
}

export function getCraftureMoves(crafture: OwnedCrafture, type: CraftureType): BattleMove[] {
  const pool = getMovesForType(type);
  const learnedIds = ensureLearnedMoveIds(type, crafture.level, crafture.learnedMoveIds ?? []);
  const learnedSet = new Set(learnedIds);
  const learnedMoves = pool.filter((m) => learnedSet.has(m.id));
  return learnedMoves.length ? learnedMoves : pool.slice(0, 1);
}
