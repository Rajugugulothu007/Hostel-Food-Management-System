import { useMemo } from "react";
import {
  VOTE_CUTOFFS,
  VOTE_OPENS,
  type MealType,
} from "../types/vote";

function todayAt(time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export interface VoteWindowInfo {
  mealType: MealType;
  opensAt: Date;
  locksAt: Date;
  isOpen: boolean;
  isLocked: boolean;
  isUpcoming: boolean;
}

export function useVoteWindows(): Record<MealType, VoteWindowInfo> {
  return useMemo(() => {
    const now = new Date();
    const result: any = {};

    (Object.keys(VOTE_CUTOFFS) as MealType[]).forEach((mealType) => {
      const locksAt = todayAt(VOTE_CUTOFFS[mealType]);
      const opensAt = todayAt(VOTE_OPENS[mealType]);

      // Breakfast opens previous day — if "opens" is after "locks", shift opens back one day
      if (opensAt > locksAt) opensAt.setDate(opensAt.getDate() - 1);

      const isLocked = now >= locksAt;
      const isUpcoming = now < opensAt;
      const isOpen = !isLocked && !isUpcoming;

      result[mealType] = {
        mealType,
        opensAt,
        locksAt,
        isOpen,
        isLocked,
        isUpcoming,
      };
    });

    return result;
  }, []);
}