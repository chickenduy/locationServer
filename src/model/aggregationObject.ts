export default class AggreagationObject {
    raw: any[]
    numberOfGroups: number
    collectedGroups: number
    anonymity: number

    constructor() {
        this.raw = []
        this.numberOfGroups = 0
        this.collectedGroups = 0
        this.anonymity = 2
    }
}