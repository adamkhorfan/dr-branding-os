export type ID = string;

export type ISODate = string;

export interface Timestamps {
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type Status = "active" | "paused" | "archived";

export type DensityMode = "comfortable" | "compact";
export type ThemeMode = "dark" | "light";
