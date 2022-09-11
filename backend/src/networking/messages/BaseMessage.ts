abstract class BaseMessage {
    type: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract getMessageData() : any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() : any {
        return {
            type: this.type,
            data: this.getMessageData(),
        }
    }
}

export default BaseMessage;
