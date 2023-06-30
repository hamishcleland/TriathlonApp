import User from "./user"

export default class Triathlon {
    userList: User[];
    userCount: number;

    constructor () {
        this.userList = [];
        this.userCount = 0;
    }

    //Formats a users name to correct title and adds a user to the triathlon. Will not allow no string objects
    public addUser(newFirstName: string, newLastName: string): string | void {
        if ((typeof newFirstName === 'string') && (typeof newLastName === 'string')) {
            newFirstName = newFirstName.toLowerCase()
            newLastName = newLastName.toLowerCase()
            newFirstName = newFirstName.charAt(0).toUpperCase() + newFirstName.slice(1);
            newLastName = newLastName.charAt(0).toUpperCase() + newLastName.slice(1);
            let aNewUser = new User(newFirstName, newLastName)
            this.userList.push(aNewUser)
            aNewUser.id = this.userCount + 1
            this.userCount++
        } else {
            return "You have entered an invalid input"
        }
    }

    //Removes a user from a triathlon object. Throws an error if a user cannot be found
    public removeUser(id: number) {
        try {
            let aUser = this.userList.find(user => user.id == id)
            if (aUser === undefined) {
                throw new Error(`The user could not be found on the list`);
            }
            let index = this.userList.indexOf(aUser)
                this.userList.splice(index, 1);
                this.userCount--
                return `${id} was removed from the list`
        } catch (error) {
            console.error(error)
            return `${id} could not be found on the list`
        }
    }

    public findUser(userId: number) {
        let aUser;
        aUser = this.userList[userId - 1]
        return aUser
    }

    //Exports a triathlon object to browser localStorage object
    public saveToLocalStorage() {
        window.localStorage.setItem("theTriathlon", JSON.stringify(this))
    }

    //Imports a triathlon object from browser localStorage object
    public loadFromLocalStorage() {
            let triathlonJSON = window.localStorage.getItem("theTriathlon")
            let aTriathlon
            if (typeof triathlonJSON === 'string') {
                aTriathlon = JSON.parse(triathlonJSON)
            }
            aTriathlon.userList.forEach(element => {
                let firstName = element.firstName
                let lastName = element.lastName
                this.userList.push(new User(firstName, lastName))
                let theUser = this.findUser(1)
                element.allMyWorkouts.forEach (item => {
                    theUser.allMyWorkouts.push(item)
                }
                )
                element.allMyEditedWorkouts.forEach (item => {
                    theUser.allMyEditedWorkouts.push(item)
                }
                )
                theUser.totalWorkoutCount = theUser.allMyWorkouts.length
                element.allMyGoals.forEach (item => {
                    theUser.allMyGoals.push(item)
                }
                )
                element.allMyEditedGoals.forEach (item => {
                    theUser.allMyEditedGoals.push(item)
                }
                )
                theUser.totalGoalCount = theUser.allMyGoals.length
            })
    }
}