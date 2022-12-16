export interface Preferences {
  readonly defaultAction: DefaultAction;
}

export enum DefaultAction {
  OpenInBrowser = "browser",
  ViewDetails = "details",
}

export enum LogStartTimes {
  FiveMinutes = "5m",
  OneHour = "1H",
  SixHours = "6H",
  TwelveHours = "12H",
  OneDay = "1D",
  ThreeDays = "3D",
}
