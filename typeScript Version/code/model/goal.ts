export default class Goal {
    name: string;
    timeRequirement: number;
    amountRequirement: number;
    numberOfWorkouts: number;
    numberOfMinutes: number;
    workoutType: string;
    date: Date;
    id?: number;
    editNum: number;
    goalComplete: boolean;

    constructor(newGoalName: string, newTimeRequirement: number, newAmountRequirement: number, newWorkoutType: string, newGoalDate: Date = new Date()) {
        this.name = newGoalName;
        this.timeRequirement = newTimeRequirement;
        this.amountRequirement = newAmountRequirement;
        this.numberOfWorkouts = 0;
        this.numberOfMinutes = 0;
        this.workoutType = newWorkoutType;
        this.date = newGoalDate;
        this.id;
        this.editNum = 0;
        this.goalComplete = false;
    }

    //Updates the progress of the goal. Called in the addWorkout function
    updateGoalProgress(workoutType: string, workoutLength: number) {
        if (workoutType == this.workoutType) {
            this.numberOfWorkouts++;
            this.numberOfMinutes = this.numberOfMinutes + workoutLength;
        }
    }

    //Checks if a goal has been completed and updates the goal complete value
    checkForGoalCompletion() {
        if (this.numberOfMinutes >= this.timeRequirement || this.numberOfWorkouts >= this.amountRequirement) {
            this.goalComplete = true;
        }
    }
}