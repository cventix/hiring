import * as sdk from 'node-appwrite';

const client = new sdk.Client();
const { APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_KEY } = process.env;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT || !APPWRITE_KEY) {
  throw new Error('Environment variables not set');
}

client
  .setEndpoint(APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(APPWRITE_PROJECT) // Your project ID
  .setKey(APPWRITE_KEY); // Your secret API key

export const database = new sdk.Database(client);
export const users = new sdk.Users(client);
export const storage = new sdk.Storage(client);
export const teams = new sdk.Teams(client);
export const account = new sdk.Account(client);
export const functions = new sdk.Functions(client);
