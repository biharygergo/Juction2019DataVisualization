export class UserUpdate {
  id: string;
  latitude: number;
  longitude: number;
  score: number;
  team: number;
}
export class LeaderboardEntry {
  id: string;
  score: number;
}
export class TeamLeaderboardEntry {
  teamId: number;
  score: number;
}
export class LocationUpdate {
  users: UserUpdate[] = [];
  leaderboard: LeaderboardEntry[] = [];
  teamLeaderboard: TeamLeaderboardEntry[] = [];
}
