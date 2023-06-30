export default class Workout {
    constructor (newType,newLength,newDate = new Date()) {
        this.type = newType
        this.lengthTime = newLength
        this.date = newDate
        this.id
        this.editNum = 0
    }
}