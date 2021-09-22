import { appwrite } from './appwrite';
import { INVITATION_CALLBACK_URL } from './constants';

export interface ITeam {
  $id: string;
  dateCreated: number;
  name: string;
  sum: number;
}

export interface IMembership {
  $id: string;
  confirm: boolean;
  email: string;
  invited: number;
  joined: number;
  name: string;
  roles: string[];
  teamId: string;
  userId: string;
}

export interface IMembershipList {
  memberships: IMembership[];
  sum: number;
}

export const createTeam = async (name: string): Promise<ITeam> => {
  return appwrite.teams.create(name);
};

export const createTeamMembership = async (
  teamId: string,
  email: string
): Promise<IMembership> => {
  return appwrite.teams.createMembership(
    teamId,
    email,
    ['member'],
    INVITATION_CALLBACK_URL
  );
};

export const createTeamMembershipServer = async (
  teamId: string,
  email: string
): Promise<IMembership> => {
  const res = await fetch('/api/teams/membership', {
    method: 'POST',
    body: JSON.stringify({ teamId, email }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
};

export const verifyMembership = async (
  teamId: string,
  membershipId: string,
  userId: string,
  secret: string
): Promise<unknown> => {
  return appwrite.teams.updateMembershipStatus(
    teamId,
    membershipId,
    userId,
    secret
  );
};

export const getTeams = async (): Promise<{ teams: ITeam[]; sum: number }> => {
  return appwrite.teams.list();
};

export const getTeam = async (teamId: string): Promise<ITeam> => {
  return appwrite.teams.get(teamId);
};

export const getTeamMembers = async (
  teamId: string
): Promise<IMembershipList> => {
  return appwrite.teams.getMemberships(teamId);
};
