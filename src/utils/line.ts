import {getStorage} from "./storage.ts";

export type Line = {
  displayName: string;
  colour: string;
};
export const Lines = {
  bakerloo: {
    displayName: "Bakerloo",
    colour: "#a45a2a",
  },
  central: {
    displayName: "Central",
    colour: "#da291c",
  },
  circle: {
    displayName: "Circle",
    colour: "#ffcd00",
  },
  district: {
    displayName: "District",
    colour: "#007a33",
  },
  hammersmithAndCity: {
    displayName: "Hammersmith & City",
    colour: "#e89cae",
  },
  jubilee: {
    displayName: "Jubilee",
    colour: "#7c878e"
  },
  metropolitan: {
    displayName: "Metropolitan",
    colour: "#840b55"
  },
  northern: {
    displayName: "Northern",
    colour: "#000000"
  },
  piccadilly: {
    displayName: "Piccadilly",
    colour: "#10069f"
  },
  victoria: {
    displayName: "Victoria",
    colour: "#00a3e0"
  },
  waterlooAndCity: {
    displayName: "Waterloo & City",
    colour: "#6eceb2"
  },

//TFL services
  elizabeth: {
    displayName: "Elizabeth Line",
    colour: "#6950a1"
  },
  dlr: {
    displayName: "DLR",
    colour: "#00afad"
  },
  trams: {
    displayName: "Trams",
    colour: "#5fb526"
  },
  cableCar: {
    displayName: "IFS Cloud Cable Car",
    colour: "#734fa0"
  },

// Overground lines
  liberty: {
    displayName: "Liberty Line",
    colour: "#5d6061"
  },
  lioness: {
    displayName: "Lioness Line",
    colour: "#faa61a"
  },
  mildmay: {
    displayName: "Mildmay Line",
    colour: "#0077ad"
  },
  suffragette: {
    displayName: "Suffragette Line",
    colour: "#5bb972"
  },
  weaver: {
    displayName: "Weaver Line",
    colour: "#823a62"
  },
  windrush: {
    displayName: "Windrush Line",
    colour: "#ed1b00"
  },
} as const satisfies Record<string, Line>;

export type LineId = keyof typeof Lines;
export const lineIds = Object.keys(Lines) as LineId[];

// Returned from `getVisitsPerLine`
export type VisitsPerLine = {
  [K in LineId]: number;
};

// Get how many times each line has been visited
export async function getVisitsPerLine() {
  const journeys = await getStorage().getJourneys();
  const visitsPerLine = Object.fromEntries(Object.keys(Lines).map((id) => [id, 0])) as VisitsPerLine;

  for (const journey of journeys) {
    for (const part of journey.parts) {
      visitsPerLine[part.line]++;
    }
  }

  return visitsPerLine;
}

// Returned from `getJourneysPerLine`
export type JourneysPerLine = {
  [K in LineId]: number;
};

// Get how many journeys each line appears in
export async function getJourneysPerLine() {
  const journeys = await getStorage().getJourneys();
  const journeysPerLine = Object.fromEntries(Object.keys(Lines).map((id) => [id, 0])) as JourneysPerLine;

  for (const journey of journeys) {
    for (const line of new Set(journey.parts.map((p) => p.line))) {
      journeysPerLine[line]++;
    }
  }

  return journeysPerLine;
}