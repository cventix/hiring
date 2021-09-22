import { appwrite } from './appwrite';
import { OAUTH_CALLBACK_URL } from './constants';

export interface IAccount {
  $id: string;
  email: string;
  emailVerification: boolean;
  name: string;
  passwordUpdate: number;
  prefs: any;
  registration: number;
  status: number;
}

const _loginUsingOAuthProvider = (provider: string) => {
  appwrite.account.createOAuth2Session(
    provider,
    OAUTH_CALLBACK_URL,
    OAUTH_CALLBACK_URL,
    ['https://www.googleapis.com/auth/calendar']
  );
};

export const loginUsingGithub = () => {
  _loginUsingOAuthProvider('github');
};

export const loginUsingGoogle = () => {
  _loginUsingOAuthProvider('google');
};

export const loginUsingCredentials = async (
  email: string,
  password: string
): Promise<unknown> => {
  return appwrite.account.createSession(email, password);
};

export const getAccount = async (): Promise<IAccount> => {
  return appwrite.account.get();
};

export const logout = async (): Promise<void> => {
  await appwrite.account.deleteSession('current');
  window.location.replace('/auth/login');
};

export const loginAnonymously = async (): Promise<IAccount> => {
  return appwrite.account.createAnonymousSession();
};

export const updateEmail = async (
  email: string,
  password: string
): Promise<IAccount> => {
  return appwrite.account.updateEmail(email, password);
};

export const updateUserPrefs = async (prefs: object): Promise<IAccount> => {
  const existingPrefs: object = await appwrite.account.getPrefs();
  return appwrite.account.updatePrefs({ ...existingPrefs, ...prefs });
};
