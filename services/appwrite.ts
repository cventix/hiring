import { Appwrite } from 'appwrite';
import { PROJECT_ID, PROJECT_ENDPOINT } from './constants';

// Init your Web SDK
const appwrite = new Appwrite();

appwrite
  .setEndpoint(PROJECT_ENDPOINT) // Your Appwrite Endpoint
  .setProject(PROJECT_ID); // Your project ID

export { appwrite };
