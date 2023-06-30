import Triathlon from "./triathlon.js"
import Workout from "./workout.js"
import Goal from "./goal.js"

export default class User {
    constructor (newFirstName, newLastName) {
        this.id = 0
        this.firstName = newFirstName
        this.lastName = newLastName
        this.allMyWorkouts = []
        this.allMyEditedWorkouts = []
        this.totalWorkoutCount = 0
        this.allMyGoals = []
        this.allMyEditedGoals = []
        this.totalGoalCount = 0
    }

    //Adds a workout to a user, date defaults to current day
    //Also adds progress towards any goals that meet the workout type
    addWorkout(newType,newLength,newDate = new Date()) {
        try {
            parseInt(newLength)
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
    removeWorkout(id) {
        try {
            let aWorkout = this.allMyWorkouts.find(workout => workout.id == id)
            let index = this.allMyWorkouts.indexOf(aWorkout)
            if (index != -1) {
                this.allMyWorkouts.splice(index, 1);
                this.totalWorkoutCount--
                return `${id} was removed from the list`
            } else {
                throw new Error(`${id} could not be found on the list`);
            }
        } catch (error) {
            console.error(error)
            return `${id} could not be found on the list`
        }
    }

    //Updates a workout parameter. Type is automatically read by the function as either string, number or date
    //Stores the old workout on a list to be used in revert function if nesessary 
    updateWorkout(id, newLength, newType, newDate) {
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

    findWorkout(id) {
        return this.allMyWorkouts.find(item => item.id == id)
    }

    //Reverts workout by id to last available item with the highest editnumber in the edited workout list
    //Only reverts single change, must use multiple times for multiple changes
    revertWorkout(id) {
        try {
            let aWorkout = this.allMyWorkouts.find(workout => workout.id == id)
            let index = this.allMyWorkouts.indexOf(aWorkout)
            if (index == -1) {
                throw new Error ("The workout is unable to be reverted as it cannot be found")
            } else {
                    let maxEditValue = 0
                    let editNums = this.allMyEditedWorkouts.map(object => {
                        return object.editNum;
                    });
                    maxEditValue = Math.max(...editNums)
                    let editedWorkout = this.allMyEditedWorkouts.find(item => (item.id == id && item.editNum == maxEditValue))
                    this.allMyWorkouts[index] = editedWorkout
                    let indexEdit = this.allMyEditedWorkouts.findIndex(item => item.id == id && item.editNum == maxEditValue)
                    this.allMyEditedWorkouts.splice(indexEdit, 1);
            }
        } catch (error) {
            console.error(error)
            return "The workout is unable to be reverted as it cannot be found"
        }
    }

    //Calculates the average workout length. Set parameter to true to return workouts of that type
    //Throws error if no workouts found
    calculateAverageWorkoutLength(bike,swim,run) {
        try {
            let total = 0, array = []
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
                total += parseInt(array[i].lengthTime);
            }
            total = total / array.length
            return total
            }
        catch(error){
            console.error(error)
            return "No workouts found"
        }
    }

    //Returns all workouts for the user
    returnAllWorkouts() {
        this.sortByDate(this.allMyWorkouts)
        return this.allMyWorkouts
    }

    //Adds a goal for a user. Defaults to current date
    addGoal(newGoalName, newTimeRequirement, newAmountRequirement,newWorkoutType, newGoalDate = new Date()) {
        let aNewGoal = new Goal(newGoalName, newTimeRequirement, newAmountRequirement,newWorkoutType, newGoalDate)
        this.allMyGoals.push(aNewGoal)
        aNewGoal.id = this.totalGoalCount
        this.totalGoalCount++
    }

    //Removes a goal for the user based on goal id
    removeGoal(id) {
        try {
            let aGoal = this.allMyGoals.find(goal => goal.id == id)
            let index = this.allMyGoals.indexOf(aGoal)
            if (index != -1) {
                this.allMyGoals.splice(index, 1);
                this.totalGoalCount--
                return `${id} was removed from the list`
            } else {
                throw new Error(`${id} could not be found on the list`);
            }
        } catch (error) {
            console.error(error)
            return `${id} could not be found on the list`
        }
    }

    findGoal(id) {
        return this.allMyGoals.find(item => item.id == id)
    }

    //Updates a goal value based on selection id. Automatically tracks to parmeter to update by type
    updateGoal(id, newGoalName,newTimeRequired, newAmountRequired,newDate) {
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
        }
        catch (error) {
            console.error(error)
            return "The Goal could not be found on the list"
        }
    }

    //Reverts a goal by id and returns the last edit from the edit list
    revertGoal(id) {
        try {
            let aGoal = this.allMyGoals.find(item => item.id == id)
            let index = this.allMyGoals.indexOf(aGoal)
            if (index == -1) {
                throw new Error ("The goal is unable to be reverted as it cannot be found")
            } else {
                    let maxEditValue = 0
                    let editNums = this.allMyEditedGoals.map(object => {
                        return object.editNum;
                    });
                    maxEditValue = Math.max(...editNums)
                    let editedGoal = this.allMyEditedGoals.find(item => (item.id == id && item.editNum == maxEditValue))
                    this.allMyGoals[index] = editedGoal
                    let indexEdit = this.allMyEditedGoals.findIndex(item => item.id == id && item.editNum == maxEditValue)
                    this.allMyEditedGoals.splice(indexEdit, 1);
            }
        } catch (error) {
            console.error(error)
            return "The goal is unable to be reverted as it cannot be found"
        }
    }

    //Sets the requirements for a goal. A workout type must also be set along with a goal ID designated
    setGoalRequirement(timeRequirement,amountRequirement,workoutType, goalID) {
        try {
            let aGoal = this.allMyGoals.find(item => item.id == goalID)
            let index = this.allMyGoals.indexOf(aGoal)
            if (index == -1) {
                throw new Error ("An invalid goal id has been entered")
            } else {
                this.allMyGoals[index].timeRequirement = timeRequirement
                this.allMyGoals[index].amountRequirement = amountRequirement
                this.allMyGoals[index].workoutType = workoutType
            }
        } catch (error) {
            console.error(error)
            return "An invalid goal id has been entered"
        }
    }

    //Sorts either the workout or goal array based on the either the "goals" or "workouts" flag
    sortByDate(type) {
        let baseArray = []
        if (type == "goals") {
            baseArray = this.allMyGoals
        } else if (type == "workouts") {
            baseArray = this.allMyWorkouts
        } else {
            return "Please enter a either goals or workouts"
        }
        return baseArray.sort(function(a,b){return a.date.getTime() - b.date.getTime()});
    }

    //Returns all workouts sorted by time of workout
    sortByTime() {
        return this.allMyWorkouts.sort(function(a,b){return a.lengthTime - b.lengthTime});
    }

    //Selects a specific date range of items for either workouts, goals or both
    //Default date range defaults to 1970 at the low range and todays date at the high range
    findItemsByDate(workouts, goals,dateRangeLow = new Date(1970,1,1),dateRangeHigh = new Date()) {
        let output = []
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
    findWorkoutByTime(minTime,maxTime) {
        let output = []
        for (let i = 0; i < this.allMyWorkouts.length; i++) {
            if (this.allMyWorkouts[i].lengthTime > minTime && this.allMyWorkouts[i].lengthTime < maxTime) {
                output.push(this.allMyWorkouts[i])
            }
        }
        return output
    }

    //Returns all goals stored in a function
    returnAllGoals() {
        this.sortByDate(this.allMyGoals)
        return this.allMyGoals
    }

    //Sends the current user to localStorage under the ID of the user
    updateLocalStorage() {
        let newObject = this
        window.localStorage.setItem(`${this.id}`, JSON.stringify(newObject))
    }
}