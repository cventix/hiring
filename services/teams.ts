import { appwrite } from './appwrite';

export interface ITeam {
  $id: string;
  dateCreated: number;
  name: string;
  sum: number;
}

export const createTeam = async (name: string): Promise<ITeam> => {
  return appwrite.teams.create(name);
};

export const createTeamMembership = async (teamId: string, email: string): Promise<unknown> => {
  return appwrite.teams.createMembership(
    teamId,
    email,
    ['candidate'],
    'http://localhost:3000/teams'
  );
};

export const verifyMembership = async (
  teamId: string,
  membershipId: string,
  userId: string,
  secret: string
): Promise<unknown> => {
  return appwrite.teams.updateMembershipStatus(teamId, membershipId, userId, secret);
};

export const getTeams = async (): Promise<{ teams: ITeam[]; sum: number }> => {
  return appwrite.teams.list();
};
