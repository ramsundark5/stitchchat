import InstallDB_v1 from './InstallDB_v1';

class MigrationManager{
     init(){
         let v1Promise = InstallDB_v1.apply();
         return Promise.all([v1Promise]);
     }
}

export default new MigrationManager();