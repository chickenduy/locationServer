export default class AggreagationObject {
    raw: any[]
    numberOfGroups: number
    collectedGroups: number

    constructor() {
        this.raw =[]
        this.numberOfGroups = 0
        this.collectedGroups = 0
    }
}