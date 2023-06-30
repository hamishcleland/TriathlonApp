import Triathlon from "./triathlon"
import Workout from "./workout"
import Goal from "./goal"

export default class User {
    id: number;
    firstName: string;
    lastName: string;
    allMyWorkouts: Workout[];
    allMyEditedWorkouts: Workout[];
    totalWorkoutCount: number;
    allMyGoals: Goal[];
    allMyEditedGoals: Goal[];
    totalGoalCount: number;

    constructor (newFirstName: string, newLastName: string) {
        this.id = 0;
        this.firstName = newFirstName;
        this.lastName = newLastName;
        this.allMyWorkouts = []
        this.allMyEditedWorkouts = []
        this.totalWorkoutCount = 0
        this.allMyGoals = []
        this.allMyEditedGoals = []
        this.totalGoalCount = 0
    }

    //Adds a workout to a user, date defaults to current day
    //Also adds progress towards any goals that meet the workout type
    addWorkout(newType: string,newLength: number,newDate = new Date()) {
        try {
            if (newType == "Swim" || newType == "Bike" || newType == "Run") {
                let aNewWorkout = new Workout(newType,newLength,newDate)
                aNewWorkout.id = this.totalWorkoutCount
                for (let i = 0; i < this.allMyGoals.length; i++) {
                    this.allMyGoals[i].updateGoalProgress(newType,newLength)
                }
                this.allMyWorkouts.push(aNewWorkout)
                this.totalWorkoutCount++
            } else {
                throw new Error("You have entered an invalid workout type");
                }
        } catch (error) {
            console.error(error)
            return "You have entered an invalid workout type"
        }
    }

    //Removes a workout from a user by user id, throws error if id not found
    removeWorkout(id: number) {
        try {
            let aWorkout = this.allMyWorkouts.find(workout => workout.id == id)
            if (aWorkout === undefined) {
                throw new Error(`The workout could not be found on the list`);
            } else {
                let index = this.allMyWorkouts.indexOf(aWorkout)
                this.allMyWorkouts.splice(index, 1);
                this.totalWorkoutCount--
                return `${id} was removed from the list`
                }
        } catch (error) {
            console.error(error)
            return `${id} could not be found on the list`
        }
    }

    //Updates a workout parameter. Type is automatically read by the function as either string, number or date
    //Stores the old workout on a list to be used in revert function if nesessary 
    updateWorkout(id:number, newLength:number, newType:string, newDate = new Date()) {
        try {
            let aWorkout = this.allMyWorkouts.find(item => item.id == id)
            if (aWorkout == null) {
                throw new Error("The Workout could not be found on the list")
            }
            let bWorkout = Object.assign({}, aWorkout);
            bWorkout.editNum++
            this.allMyEditedWorkouts.push(bWorkout)
            let index = this.allMyWorkouts.indexOf(aWorkout)
            this.allMyWorkouts[index].type = newType
            this.allMyWorkouts[index].date = newDate
            this.allMyWorkouts[index].lengthTime = newLength 
            aWorkout.editNum++
        }
        catch (error) {
            console.error(error)
            return "The Workout could not be found on the list"
        }
    }

    findWorkout(id: number) {
        return this.allMyWorkouts.find(item => item.id == id)
    }

    //Reverts workout by id to last available item with the highest editnumber in the edited workout list
    //Only reverts single change, must use multiple times for multiple changes
    revertWorkout(id: number) {
        try {
            let aWorkout = this.allMyWorkouts.find(workout => workout.id == id)
            if (aWorkout === undefined) {
                throw new Error(`The workout could not be found on the list`);
            }
            let index = this.allMyWorkouts.indexOf(aWorkout)
                let maxEditValue = 0
                let editNums = this.allMyEditedWorkouts.map(object => {
                return object.editNum;
                });
                maxEditValue = Math.max(...editNums)
                let editedWorkout = this.allMyEditedWorkouts.find(item => (item.id == id && item.editNum == maxEditValue))
                if (editedWorkout === undefined) {
                    throw new Error ("There are no previous versions of the workout")
                } else {
                    this.allMyWorkouts[index] = editedWorkout
                    let indexEdit = this.allMyEditedWorkouts.findIndex(item => item.id == id && item.editNum == maxEditValue)
                    this.allMyEditedWorkouts.splice(indexEdit, 1);
                }
        } catch (error) {
            console.error(error)
            return (`The workout could not be reverted`)
        }
    }

    //Calculates the average workout length. Set parameter to true to return workouts of that type
    //Throws error if no workouts found
    calculateAverageWorkoutLength(bike: boolean,swim: boolean,run: boolean) {
        try {
            let total = 0, array: Workout[] = []
            if (bike == true) {
                array.push(...(this.allMyWorkouts.filter(workout => workout.type === 'Bike')))
            }
            if (swim == true) {
                array.push(...(this.allMyWorkouts.filter(workout => workout.type === 'Swim')))
            }
            if (run == true) {
                array.push(...(this.allMyWorkouts.filter(workout => workout.type === 'Run')))
            }
            if (array.length == 0) {
                throw new Error("No workouts found")
            }
            for (let i = 0; i < array.length; i++) {
                total += array[i].lengthTime;
            }
            total = total / array.length
            return total
            }
        catch(error){
            console.log(error)
            return "No workouts found"
        }
    }

    //Returns all workouts for the user
    returnAllWorkouts(sorting: boolean) {
        let type = "workouts"
        if(sorting === true) {
            this.sortByDate(type)
        } else {
            this.sortByTime()
        }
        return this.allMyWorkouts
    }

    //Adds a goal for a user. Defaults to current date
    addGoal(newGoalName: string, newTimeRequirement: number, newAmountRequirement: number,newWorkoutType: string, newGoalDate = new Date()) {
        let aNewGoal = new Goal(newGoalName, newTimeRequirement, newAmountRequirement,newWorkoutType, newGoalDate)
        this.allMyGoals.push(aNewGoal)
        aNewGoal.id = this.totalGoalCount
        this.totalGoalCount++
    }

    //Removes a goal for the user based on goal id
    removeGoal(id: number) {
        try {
            let aGoal = this.allMyGoals.find(goal => goal.id == id)
            if (aGoal === undefined) {
                throw new Error(`The goal could not be found on the list`);
            }
            let index = this.allMyGoals.indexOf(aGoal)
            this.allMyGoals.splice(index, 1);
            this.totalGoalCount--
            return `${id} was removed from the list`
        } catch (error) {
            console.error(error)
            return `${id} could not be found on the list`
        }
    }

    findGoal(id: number) {
        return this.allMyGoals.find(item => item.id == id)
    }

    //Updates a goal value based on selection id. Automatically tracks to parmeter to update by type
    updateGoal(id: number, newGoalName: string,newTimeRequired: number, newAmountRequired: number,newDate = new Date()) {
        try {
            let aGoal = this.allMyGoals.find(item => item.id == id)
            if (aGoal == null) {	
                throw new Error("The Goal could not be found on the list")	
            }	
            let bGoal = Object.assign({}, aGoal);	
            bGoal.editNum++
            this.allMyEditedGoals.push(bGoal)
            let index = this.allMyGoals.indexOf(aGoal)
            this.allMyGoals[index].name = newGoalName
            this.allMyGoals[index].timeRequirement = newTimeRequired
            this.allMyGoals[index].amountRequirement = newAmountRequired
            this.allMyGoals[index].date = newDate
            aGoal.editNum++
        }
        catch (error) {
            console.error(error)
            return "The Goal could not be found on the list"
        }
    }

    //Reverts a goal by id and returns the last edit from the edit list
    revertGoal(id: number) {
        try {
            let aGoal = this.allMyGoals.find(item => item.id == id)
            if (aGoal === undefined) {
                throw new Error(`The goal could not be found on the list`);
            }
            let index = this.allMyGoals.indexOf(aGoal)
                    let maxEditValue = 0
                    let editNums = this.allMyEditedGoals.map(object => {
                        return object.editNum;
                    });
                    maxEditValue = Math.max(...editNums)
                    let editedGoal = this.allMyEditedGoals.find(item => (item.id == id && item.editNum == maxEditValue))
                    if (editedGoal === undefined) {
                        throw new Error ("There are no previous versions of the goal")
                    } else {
                        this.allMyGoals[index] = editedGoal
                        let indexEdit = this.allMyEditedGoals.findIndex(item => item.id == id && item.editNum == maxEditValue)
                        this.allMyEditedGoals.splice(indexEdit, 1);
                    }
        } catch (error) {
            console.error(error)
            return ("The Goal Could not be Reverted")
        }
    }

    //Sets the requirements for a goal. A workout type must also be set along with a goal ID designated
    setGoalRequirement(timeRequirement: number,amountRequirement: number,workoutType: string, goalID: number) {
        try {
            let aGoal = this.allMyGoals.find(item => item.id == goalID)
            if (aGoal === undefined) {
                throw new Error(`The goal could not be found on the list`);
            }
            let index = this.allMyGoals.indexOf(aGoal)
            this.allMyGoals[index].timeRequirement = timeRequirement
            this.allMyGoals[index].amountRequirement = amountRequirement
            this.allMyGoals[index].workoutType = workoutType
        } catch (error) {
            console.error(error)
            return "An invalid goal id has been entered"
        }
    }

    //Sorts either the workout or goal array based on the either the "goals" or "workouts" flag
    sortByDate(type: string) {
        let baseArray: (Goal|Workout)[] = []
        if (type == "goals") {
            baseArray = this.allMyGoals
        } else if (type == "workouts") {
            baseArray = this.allMyWorkouts
        } else {
            return "Please enter a either goals or workouts"
        }
        return baseArray.sort(function(a,b){return (a.date.getTime() - b.date.getTime())});
    }

    //Returns all workouts sorted by time of workout
    sortByTime() {
        return this.allMyWorkouts.sort(function(a,b){return a.lengthTime - b.lengthTime});
    }

    //Selects a specific date range of items for either workouts, goals or both
    //Default date range defaults to 1970 at the low range and todays date at the high range
    findItemsByDate(workouts: boolean, goals: boolean,dateRangeLow = new Date(1970,1,1),dateRangeHigh = new Date()) {
        let output: (Goal|Workout)[] = []
        if (workouts == true) {
            for (let i = 0; i < this.allMyWorkouts.length; i++) {
                if (this.allMyWorkouts[i].date > dateRangeLow && this.allMyWorkouts[i].date < dateRangeHigh) {
                    output.push(this.allMyWorkouts[i])
                }
            }
        }
        if (goals == true) {
            for (let i = 0; i < this.allMyGoals.length; i++) {
                if (this.allMyGoals[i].date > dateRangeLow && this.allMyGoals[i].date < dateRangeHigh) {
                    output.push(this.allMyGoals[i])
                }
            }
        }
        return output
    }

    //Filters workouts by a specific time range
    findWorkoutByTime(minTime: number,maxTime: number) {
        let output: (Goal|Workout)[] = []
        for (let i = 0; i < this.allMyWorkouts.length; i++) {
            if (this.allMyWorkouts[i].lengthTime > minTime && this.allMyWorkouts[i].lengthTime < maxTime) {
                output.push(this.allMyWorkouts[i])
            }
        }
        return output
    }

    //Returns all goals stored in a function
    returnAllGoals(sorting: string) {
        this.sortByDate(sorting)
        return this.allMyGoals
    }

    //Sends the current user to localStorage under the ID of the user
    updateLocalStorage() {
        let newObject = this
        window.localStorage.setItem(`${this.id}`, JSON.stringify(newObject))
    }
}