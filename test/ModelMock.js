import AttributeMock from "./AttributeMock";
import Observable from "./Observable";

export default class ModelMock extends Observable {
    
    constructor() {
        super();
        this.entityName = 'testEntity';
        this.context = 'testContext';
        this.attributes = {};
    }

    addAttribute(name) {
        this.attributes[name] = new AttributeMock(name);
    }
}