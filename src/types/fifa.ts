export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'RW' | 'LW' | 'ST';

export interface PlayerStats {
  pace: number;        // 1 - 99
  shooting: number;    // 1 - 99
  passing: number;     // 1 - 99
  dribbling: number;   // 1 - 99
  defending: number;   // 1 - 99
  physical: number;    // 1 - 99
  overall: number;     // 1 - 99
}

export interface PlayerData {
  id: string;
  name: string;
  shortName: string;
  number: number;
  position: Position;
  stats: PlayerStats;
  skinTone: string;     // Hex color
  hairColor: string;    // Hex color
  hairStyle: 'short' | 'buzz' | 'flow' | 'dreads' | 'afro' | 'bald';
  height: number;       // In meters (1.70 - 1.95)
  preferredFoot: 'left' | 'right';
  avatarUrl?: string;
}

export interface TeamData {
  id: string;
  name: string;
  shortName: string;
  crest: string;        // Club emoji or SVG
  primaryColor: string; // Jersey color
  secondaryColor: string;// Shorts color
  socksColor: string;
  numbersColor: string;
  keeperColor: string;
  formation: '4-3-3' | '4-4-2' | '3-5-2';
  players: PlayerData[];
}

export type MatchPhase =
  | 'TEAM_SELECT'
  | 'KICKOFF'
  | 'PLAYING'
  | 'GOAL'
  | 'HALFTIME'
  | 'FULLTIME'
  | 'PAUSED';

export type GameMode = 'USER_VS_AI' | 'AI_VS_AI';

export type CameraView = 'BROADCAST' | 'TELE' | 'ACTION' | 'TOP_DOWN';

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'SAVE' | 'POST' | 'FOUL' | 'KICKOFF';
  player: string;
  team: string;
  description: string;
}

export interface MatchStats {
  homeGoals: number;
  awayGoals: number;
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homePossession: number; // percentage
  awayPossession: number;
  homePasses: number;
  awayPasses: number;
}
