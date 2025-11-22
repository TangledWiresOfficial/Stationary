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