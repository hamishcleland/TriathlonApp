export default class Workout {
    type: string;
    lengthTime: number;
    date: Date;
    id?: number;
    editNum: number;

    constructor (newType: string, newLength: number, newDate: Date = new Date()) {
        this.type = newType
        this.lengthTime = newLength
        this.date = newDate
        this.editNum = 0
    }
}