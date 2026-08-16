/**
 * Game Client Download Controller
 */
import { DownloadService } from '../services/downloadService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export class DownloadController {
  static getDownloads(req, res) {
    const packages = DownloadService.getDownloadPackages();
    return sendSuccess(res, 'Game client download packages retrieved', packages, 200);
  }
}
