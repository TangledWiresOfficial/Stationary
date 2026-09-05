export type Achievement = {
  name: string,
  description: string,
  // Extra text shown below the description
  quote?: string,
  // Path to the icon file
  iconPath: string,
};

export const Achievements: Record<string, Achievement> = {
  visitWiganNorthWestern: {
    name: "Wigan North Western",
    description: "Visit Wigan North Western.",
    quote: "Welcome on board this Avanti West Coast service to...",
    iconPath: "/achievementIcons/visitWiganNorthWestern.svg"
  },
  journeySameStartAndEnd: {
    name: "This place looks familiar...",
    description: "Record a journey where you end up back where you started.",
    iconPath: "/achievementIcons/journeySameStartAndEnd.svg"
  },
  allStationsCircle: {
    name: "It's come full circle!",
    description: "Visit all stations on the Circle line.",
    iconPath: "/achievementIcons/allStationsCircle.svg"
  },
  allStationsGlasgowSubway: {
    name: "Circle Line 2: Electric Boogaloo",
    description: "Visit all stations on the Glasgow Subway.",
    quote: "This one's still a circle!",
    iconPath: "/achievementIcons/allStationsGlasgowSubway.svg"
  },
  allStationsLondonUnderground: {
    name: "Mind All The Gaps",
    description: "Visit all stations on the London Underground.",
    quote: "Mind the gap between the train and the platform.",
    iconPath: "/achievementIcons/allStationsLondonUnderground.svg"
  }
};

export type AchievementId = keyof typeof Achievements;
export const achievementIds = Object.keys(Achievements) as AchievementId[];

export type ObtainedAchievement = {
  achievementId: AchievementId;
  obtainedAt: Date;
};