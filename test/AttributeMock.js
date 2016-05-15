import Observable from "./Observable";

export default class AttributeMock extends Observable {
    
    constructor(name) {
        super();
        this.name = name;
        this.type = 'string';
        this.value = 'testValue';
    }
}