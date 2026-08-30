import {migration, renameStation} from "./registry.ts";

migration(9, 10, (journey) => {
  renameStation(journey, "stkeyneWishingWellHalt", "stKeyneWishingWellHalt");
  renameStation(journey, "halli'th'wood", "hallithwood");

  return journey;
});