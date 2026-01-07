import { Client, Account } from "appwrite";

const { VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID } = import.meta.env;
console.log(VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID)

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

export { account };