export type Line = {
  displayName: string
  colour: string
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
} as const satisfies Record<string, Line>;