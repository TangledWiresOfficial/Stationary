import {migration, renameStation} from "./registry.ts";

migration(8, 9, (journey) => {
  renameStation(journey, "butler'sHill", "butlersHill");
  renameStation(journey, "kingslynn", "kingsLynn");
  renameStation(journey, "queen'sMedicalCentre", "queensMedicalCentre");
  renameStation(journey, "stJamesPark", "stJamessPark");

  return journey;
});