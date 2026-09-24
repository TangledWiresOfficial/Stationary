import {DataStorage, getStorage} from "./storage.ts";
import {LineId, StationId, Stations} from "@tangledwires/gb-station-data";

export type Achievement = {
  name: string,
  description: string,
  // Extra text shown below the description
  quote?: string,
  // Path to the icon file
  iconPath: string,

  // Function that checks whether the conditions of this achievement have been met
  conditionCheck: (storage: DataStorage) => Promise<boolean>,
};

export const Achievements: Record<string, Achievement> = {
  visitWiganNorthWestern: {
    name: "Wigan North Western",
    description: "Visit Wigan North Western.",
    quote: "Welcome on board this Avanti West Coast service to...",
    iconPath: "/achievementIcons/visitWiganNorthWestern.svg",

    conditionCheck: async (storage) => {
      const journeys = await storage.getJourneys();

      for (const j of journeys) {
        for (const p of j.parts) {
          if (p.station === "wiganNorthWestern") return true;
        }
      }

      return false;
    }
  },
  journeySameStartAndEnd: {
    name: "This place looks familiar...",
    description: "Record a journey where you end up back where you started.",
    iconPath: "/achievementIcons/journeySameStartAndEnd.svg",

    conditionCheck: async (storage) => {
      const journeys = await storage.getJourneys();

      for (const j of journeys) {
        if (j.parts[0].station === j.parts[j.parts.length - 1].station) return true;
      }

      return false;
    }
  },
  allStationsCircle: {
    name: "It's come full circle!",
    description: "Visit all stations on the Circle line.",
    iconPath: "/achievementIcons/allStationsCircle.svg",

    conditionCheck: async (storage) => {
      return allStationsOnLinesCheck(["circle"], storage);
    }
  },
  allStationsGlasgowSubway: {
    name: "Circle Line 2: Electric Boogaloo",
    description: "Visit all stations on the Glasgow Subway.",
    quote: "This one's still a circle!",
    iconPath: "/achievementIcons/allStationsGlasgowSubway.svg",

    conditionCheck: async (storage) => {
      return allStationsOnLinesCheck(["glasgowSubway"], storage);
    }
  },
  allStationsLondonUnderground: {
    name: "Mind All The Gaps",
    description: "Visit all stations on the London Underground.",
    quote: "Mind the gap between the train and the platform.",
    iconPath: "/achievementIcons/allStationsLondonUnderground.svg",

    conditionCheck: async (storage) => {
      return allStationsOnLinesCheck([
        "bakerloo",
        "central",
        "circle",
        "district",
        "hammersmithAndCity",
        "jubilee",
        "metropolitan",
        "northern",
        "piccadilly",
        "victoria",
        "waterlooAndCity"
      ], storage);
    }
  }
};

export type AchievementId = keyof typeof Achievements;
export const achievementIds = Object.keys(Achievements) as AchievementId[];

export type ObtainedAchievement = {
  achievementId: AchievementId;
  obtainedAt: Date;
};

/**
 * Check if all stations on specified lines have been visited.
 *
 * @param lines The lines to check
 * @param storage Storage
 */
async function allStationsOnLinesCheck(lines: LineId[], storage: DataStorage) {
  const journeys = await storage.getJourneys();
  const all = Object.keys(Stations).filter((k) => Stations[k as StationId].lines.some((l) => lines.includes(l))) as StationId[];
  console.debug(`Required stations: ${all}`);

  const visited: StationId[] = [];

  for (const j of journeys) {
    for (const p of j.parts) {
      if (all.includes(p.station) && !visited.includes(p.station)) visited.push(p.station);
    }
  }
  console.debug(`Visited stations: ${visited}`);
  return visited.length === all.length;
}

export async function checkAchievements() {
  const storage = getStorage();
  const obtainedAchievements = await storage.getObtainedAchievements();

  for (const [id, achievement] of Object.entries(Achievements)) {
    if (obtainedAchievements.some((oa) => oa.achievementId === id)) {
      console.log(`Skipping achievement check for ${id} because it has already been obtained`);
      continue;
    }

    console.log(`Starting achievement check for ${id}`);
    if (await achievement.conditionCheck(storage)) {
      console.log(`Conditions met for achievement ${id}`);

      obtainedAchievements.push({ achievementId: id, obtainedAt: new Date() });
      await storage.setObtainedAchievements(obtainedAchievements);
      console.log(`Unlocked achievement ${id}`);
      alert(`Achievement unlocked: "${achievement.name}"`)
    }
  }
}