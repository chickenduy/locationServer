export default class AggreagationModel {
    raw: any[]
    n: number
    numberOfGroups: number
    collectedGroups: number
    anonymity: number

    constructor() {
        this.raw = []
        this.numberOfGroups = 0
        this.collectedGroups = 0
        this.anonymity = 2
        this.n = 0
    }
}