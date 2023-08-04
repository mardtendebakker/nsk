import { AFile } from './axios/models/aFile';

export function buildAFileLink(afile: AFile): string {
  return `https://${afile.unique_server_filename}.s3.amazonaws.com/${afile.discr}/${afile.original_client_filename}`;
}
