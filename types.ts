
export enum DoorStatus {
  OK = 'ok',
  NOT_YET = 'not yet'
}

export interface LocationEntry {
  id: string;
  name: string;
  gps: string;
  doorStatus: DoorStatus;
  createdAt: string;
  updatedAt: string;
}

export type User = {
  username: string;
  isLoggedIn: boolean;
};
