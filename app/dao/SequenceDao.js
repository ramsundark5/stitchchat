import realm from './Realm';

class SequenceDao{

    getNextSeqId(sequenceName){
        let currentSequence = realm.objects('Sequence').filtered('name = $0', sequenceName)[0];
        if(currentSequence && currentSequence.name){
            currentSequence.value = currentSequence.value + 1;
        }else{
            currentSequence = realm.create('Sequence', {'name': sequenceName, 'value': 1});
        }
        let nextVal = currentSequence.value;
        return nextVal;
    }
}

export default new SequenceDao();