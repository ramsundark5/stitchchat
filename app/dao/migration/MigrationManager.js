import InstallDB_v1 from './InstallDB_v1';
import DBHelper from '../DBHelper';
import * as AppConstants from '../../constants/AppConstants';

class MigrationManager{
     async init(){
         await DBHelper.initDB(AppConstants.MESSAGES_DB);
         let v1Promise = InstallDB_v1.apply();
         return Promise.all([v1Promise]);
     }
}

export default new MigrationManager();