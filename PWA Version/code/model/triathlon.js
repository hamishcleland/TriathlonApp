import User from "./user.js"
import Workout from "./workout.js"
import Goal from "./goal.js"
// import {mockWindowProperty} from "./__Tests__/triathlon.test.js"
// import dbConnectivity from "./dbConnectivity"

export default class Triathlon { 
    constructor () {
        this.userList = []
        this.userCount = 0
    }

    //Formats a users name to correct title and adds a user to the triathlon. Will not allow no string objects
    addUser(newFirstName, newLastName) {
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
    removeUser(id) {
        try {
            let aUser = this.userList.find(user => user.id == id)
            let index = this.userList.indexOf(aUser)
            if (index != -1) {
                this.userList.splice(index, 1);
                this.userCount--
                return `${id} was removed from the list`
            } else {
                throw new Error(`${id} could not be found on the list`);
            }
        } catch (error) {
            console.error(error)
            return `${id} could not be found on the list`
        }
    }

    findUser(userId) {
        let aUser;
        aUser = this.userList[userId - 1]
        return aUser
    }

    //Exports a triathlon object to browser localStorage object
    saveToLocalStorage() {
        window.localStorage.setItem("theTriathlon", JSON.stringify(this))
    }

    //Imports a triathlon object from browser localStorage object
    loadFromLocalStorage() {
        try {
            let triathlonJSON = window.localStorage.getItem("theTriathlon")
            let aTriathlon = JSON.parse(triathlonJSON)
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
                theUser.totalWorkoutCount = theUser.allMyGoals.length
            });
        }
        catch (err) {
            alert(err)
        }
    }

    //This code was unfinished and will be worked on at a later date. Modified from code sourced at https://moodle.ara.ac.nz/mod/equella/view.php?id=1343773
    /* exportToSqlDB() {
            console.log('Demonstrate connection ...')
          
            // create the connection
            const config = {
              host: 'localhost',
              user: 'root',
              password: 'admin',
            }
          
            const mysqlDB = new dbConnectivity()
            mysqlDB.createConnection(config)
            let result = mysqlDB.connect()
            console.log(result)
          
            // create a database
            result = mysqlDB.createDB('theTriathlon')
            console.log(result)
        
            // query a database
            let sqlQuery = 'USE theTriathlon'
            result = mysqlDB.executeSqlQuery(sqlQuery)
            console.log(result)
        
            sqlQuery =
            'CREATE TABLE IF NOT EXISTS ' +
            'users (id SMALLINT(255), firstName VARCHAR(255), lastName VARCHAR(255))'
            result = mysqlDB.executeSqlQuery(sqlQuery)
            console.log(result)
            let userListForExport = []
            for (let i = 0; i < this.userList.length; i++) {
            let exportItem = []
            exportItem.push(this.userList[i].id)
            exportItem.push(this.userList[i].firstName)
            exportItem.push(this.userList[i].lastName)
            userListForExport.push(exportItem)
            }
            sqlQuery = 'INSERT INTO theTriathlon (id, firstName, lastName) userListforExport ?'
            mysqlDB.insertRecords(sqlQuery, userListForExport)
            sqlQuery = 'SELECT * from users'
            mysqlDB.getAllRecords(sqlQuery)
          
            // delete a database
            //result = mysqlDB.dropDB('theTriathlon')
            //console.log(result)
        
            // end the connection
            result = mysqlDB.disconnect()
            console.log(result)
    } */
}