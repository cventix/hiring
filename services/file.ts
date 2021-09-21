import { appwrite } from './appwrite';

interface IUploadedFile {
  $id: string;
  $permissions: {
    read: string;
    write: string;
  };
  dateCreated: number;
  mimeType: string;
  name: string;
  signature: string;
  sizeOriginal: number;
}

export const uploadFile = async (file: File): Promise<IUploadedFile> => {
  return appwrite.storage.createFile(file);
};

export const getFileView = async (fileId: string): Promise<unknown> => {
  return appwrite.storage.getFileView(fileId);
};
