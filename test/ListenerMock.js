export default class ListenerMock {

    constructor() {
        this.called = 0;
        this.lastArguments = [];
    }

    update() {
        ++this.called;
        this.lastArguments = arguments;
    }
}