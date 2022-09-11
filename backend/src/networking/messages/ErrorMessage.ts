import BaseMessage from './BaseMessage';

class ErrorMessage extends BaseMessage {
    type = 'error';
    message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    getMessageData() {
        return { message: this.message };
    }
}

export default ErrorMessage;
