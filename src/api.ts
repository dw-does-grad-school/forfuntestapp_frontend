import { makeFunctionReference } from "convex/server";

type Goal = "basic" | "half" | "full";
type Skill = "new" | "building" | "confident";
type ProfileSkills = { swim: Skill; bike: Skill; run: Skill };
type Profile = {
  goal: Goal;
  skills: ProfileSkills;
  equipment: string[];
  customEquipment: string[];
  updatedAt: number;
};
type SaveProfileArgs = {
  goal: Goal;
  skills: ProfileSkills;
  equipment: string[];
  customEquipment: string[];
};

export const api = {
  profiles: {
    get: makeFunctionReference<"query", Record<string, never>, Profile | null>("profiles:get"),
    save: makeFunctionReference<"mutation", SaveProfileArgs, string>("profiles:save"),
  },
};
