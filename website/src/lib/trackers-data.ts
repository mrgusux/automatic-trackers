import trackersJson from "./data/trackers.json";
import { TrackersDataset } from "./types";

export function getTrackersDataset(): TrackersDataset {
  return trackersJson as unknown as TrackersDataset;
}
