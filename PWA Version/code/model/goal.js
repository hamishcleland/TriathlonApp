export default class Goal {
    constructor (newGoalName, newTimeRequirement, newAmountRequirement,newWorkoutType, newGoalDate = new Date()) {
        this.name = newGoalName
        this.timeRequirement = newTimeRequirement
        this.amountRequirement = newAmountRequirement
        this.numberOfWorkouts = 0
        this.numberOfMinutes = 0
        this.workoutType = newWorkoutType
        this.date = newGoalDate
        this.id
        this.editNum = 0
        this.goalComplete = false
    }

    //Updates the progress of the goal. Called in the addWorkout function
    updateGoalProgress(workoutType,workoutLength) {
        if (workoutType == this.workoutType) {
            this.numberOfWorkouts++
            this.numberOfMinutes = this.numberOfMinutes + workoutLength
        }
    }
    

    //Checks if a goal has been completed and updates the goal complete value
    checkForGoalCompletion() {
        if (this.numberOfMinutes >= this.timeRequirement || this.numberOfWorkouts >= this.amountRequirement) {
            this.goalComplete = true
            }
        }
}