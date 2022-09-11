import User from '../../models/User';
import BaseMessage from './BaseMessage';

class UserJoinedMessage extends BaseMessage {
    type = 'user-joined';
    user: User;

    constructor(user: User) {
        super();
        this.user = user;
    }

    getMessageData() {
        return { id: this.user.id, name: this.user.name };
    }
}

export default UserJoinedMessage;
