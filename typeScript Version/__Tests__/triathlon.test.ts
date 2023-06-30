import Triathlon from '../code/model/triathlon'
import User from '../code/model/user'
import Workout from "../code/model/workout"
import Goal from "../code/model/goal"

// For mocking localStorage, code taken from https://www.codeblocq.com/2021/01/Jest-Mock-Local-Storage/ 
const fakeLocalStorage = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    }
  };
})();

// For mocking localStorage, code taken from https://www.codeblocq.com/2021/01/Jest-Mock-Local-Storage/ 
const mockWindowProperty = (property, value) => {
    const {[property]: originalProperty } = window;
    delete window[property];
    beforeAll(() => {
      Object.defineProperty(window, property, {
        configurable: true,
        writable: true,
        value,
      });
    });
    afterAll(() => {
      window[property] = originalProperty;
    });
  };

describe("A triathlon user is created", function () {
    let theTriathlon,aUser,bUser,aWorkout,aGoal

    //Creating a Triathlon object, adding a user, adding a goal
    beforeEach(() => {
        theTriathlon = new Triathlon()
        theTriathlon.addUser('hAmIsh','cLElaNd')
        aUser = theTriathlon.userList[0]
        aUser.addWorkout("Bike",45,new Date(2021,3,6))
        aUser.addGoal("Complete 10 workouts over 30 minutes",10,30,"Run",new Date(2020,4,3))
        aWorkout = aUser.allMyWorkouts[0]
        aGoal = aUser.allMyGoals[0]
    })

    describe("An Empty Triathlon was Created", function () {
        test("should have a userList property", function () {
            expect(
                Object.prototype.hasOwnProperty.call(theTriathlon, "userList")
            ).toBeTruthy()
        })

        test("Should have a userCount Property", function () {
            const count = theTriathlon.userCount
            expect(count).toEqual(1)
        })
    })

    describe("An Invalid User Created", function () {
        test("should have a userList property", function () {
            expect(
                theTriathlon.addUser(true,false)
            ).toBe("You have entered an invalid input")
        })
    })

    describe("Checking First Name", function () {
        test("Expect first name to be correct", function () {
            expect(
                aUser.firstName
            ).toBe('Hamish')
        })
    })

    describe("Checking Last Name", function () {
        test("Expect Last Name to be Correct", function () {
            expect(
                aUser.lastName
            ).toBe('Cleland')
        })
    })

    describe("Checking id", function () {
        test("Expect id to be Correct", function () {
            expect(
                aUser.id
            ).toBe(1)
        })
    })

    describe("Find Workout", function () {
        test("Expect workout to be Found", function () {
            expect(
                aUser.findWorkout(0).type
            ).toBe("Bike")
        })
    })

    describe("Removing a User", function () {
        beforeEach(() => {
            theTriathlon.removeUser(1)
        })

        test("User is Removed from userList after removal", function () {
            expect(
                theTriathlon.userList
            ).toEqual([])
        })

        test("userCount is zero after removal", function () {
            expect(
                theTriathlon.userCount
            ).toBe(0)
        })

        test("Invalid user index entered - should return failure message", function () {
            expect(
                theTriathlon.removeUser(7)
            ).toEqual("7 could not be found on the list")
        })
        
    })

    describe("Adding Workout Functions", function () {  
        test("Workout constructor works with default parameters", function () {
            let workout = new Workout("Run", 56)
            expect(
                workout.lengthTime
            ).toBe(56)
            expect(
                workout.date
            ).toEqual(new Date())
        })

        test("Adding Invalid Workout Parameters - should return failure message", function () {
            expect(
                aUser.addWorkout("Glide", 76)
            ).toBe("You have entered an invalid workout type")
        })
        
        test("Workout Type Correctly updates on Add", function () {
            expect(
                aWorkout.type
            ).toBe("Bike")
        })

        test("lengthTime Correctly updates on Add", function () {
            expect(
                aWorkout.lengthTime
            ).toBe(45)
        })

        test("Date Correctly updates on Add", function () {
            expect(
                aWorkout.date
            ).toEqual(new Date(2021,3,6))
        })

        test("id Correctly updates on Add", function () {
            expect(
                aWorkout.id
            ).toEqual(0)
        })
    })

    describe("Updating Workout Functions", function () {  
        //Updating a workout to check if changes are correct
        beforeEach(() => {
            aUser.updateWorkout(0,60,"Run", new Date(2021,3,5))
            aWorkout = aUser.allMyWorkouts[0]
        })

        test("Workout Type Correctly updates on update", function () {
            expect(
                aWorkout.type
            ).toBe("Run")
        })

        test("lengthTime Correctly updates on update", function () {
            expect(
                aWorkout.lengthTime
            ).toBe(60)
        })

        test("Date Correctly updates on update", function () {
            expect(
                aWorkout.date
            ).toEqual(new Date(2021,3,5))
        })

        test("Update Invalid Workout - should return failure message", function () {
            expect(
                aUser.updateWorkout(8)
            ).toBe("The Workout could not be found on the list")
        })

        //Reverting the changes made back to default
        describe("Reverting Workout Functions", function () {  
            beforeEach(() => {
                aUser.revertWorkout(0)
                aUser.revertWorkout(0)
                aUser.revertWorkout(0)
                aWorkout = aUser.allMyWorkouts[0]
            })
    
            test("Workout Type correctly updates on Revert", function () {
                expect(
                    aWorkout.type
                ).toBe("Bike")
            })
    
            test("lengthTime correctly updates on Revert", function () {
                expect(
                    aWorkout.lengthTime
                ).toBe(45)
            })
    
            test("Date correctly updates on Revert", function () {
                expect(
                    aWorkout.date
                ).toEqual(new Date(2021,3,6))
            })

            test("Revert Invalid Workout - should return failure message", function () {
                expect(
                    aUser.revertWorkout(89)
                ).toBe(`The workout could not be reverted`)
            })

            test("Revert Workout when none Available - should return failure message", function () {
                expect(
                    aUser.revertWorkout(0)
                ).toBe(`The workout could not be reverted`)
            })
        })
    })


    describe("Remove Workout Functions", function () {
        //Removing a workout
        beforeEach(() => {
            aUser.removeWorkout(0)
        })
        
        test("Workout is removed from workout list", function () {
            expect(
                aUser.allMyWorkouts
            ).toEqual([])
            
        })

        test("workoutCount is zero after Removal", function () {
            expect(
                aUser.totalWorkoutCount
            ).toBe(0)
        })

        test("Adding Invalid Id for Removal - should return failure message", function () {
            expect(
                aUser.removeWorkout(9)
            ).toBe("9 could not be found on the list")
        })
    })

    describe("Calculate average workout length", function () {
        //Adding a variety of workouts for calculations
        beforeEach(() => {
            aUser.addWorkout("Bike",35,new Date(2021,3,6))
            aUser.addWorkout("Bike",55,new Date(2021,3,6))
            aUser.addWorkout("Run",30,new Date(2021,3,6))
            aUser.addWorkout("Run",40,new Date(2021,3,6))
            aUser.addWorkout("Run",50,new Date(2021,3,6))
            aUser.addWorkout("Swim",60,new Date(2021,3,6))
            aUser.addWorkout("Swim",70,new Date(2021,3,6))
            aUser.addWorkout("Swim",80,new Date(2021,3,6))
        })
        
        test("Calculate all workouts average value correctly", function () {
            expect(
                aUser.calculateAverageWorkoutLength(true,true,true)
            ).toEqual(51.666666666666664)
        })

        test("Calculate bike workouts average value correctly", function () {
            expect(
                aUser.calculateAverageWorkoutLength(true,false,false)
            ).toEqual(45)
        })

        test("Calculate swim workouts average value correctly", function () {
            expect(
                aUser.calculateAverageWorkoutLength(false,true,false)
            ).toEqual(70)
        })

        test("Calculate run workouts average value correctly", function () {
            expect(
                aUser.calculateAverageWorkoutLength(false,false,true)
            ).toEqual(40)
        })

        test("Calculate swim and run workouts average value correctly", function () {
            expect(
                aUser.calculateAverageWorkoutLength(false,true,true)
            ).toEqual(55)
        })

        test("ReturnAllWorkouts function returns all", function () {
            let allWorkouts = aUser.returnAllWorkouts()
            expect(
                allWorkouts.length
            ).toEqual(9)
        })

        test("No workouts to calculate", function () {
            //Removing all workouts from the list
            aUser.removeWorkout(0)
            aUser.removeWorkout(1)
            aUser.removeWorkout(2)
            aUser.removeWorkout(3)
            aUser.removeWorkout(4)
            aUser.removeWorkout(5)
            aUser.removeWorkout(6)
            aUser.removeWorkout(7)
            aUser.removeWorkout(8)
            expect(
                aUser.calculateAverageWorkoutLength(true,true,true)
            ).toBe("No workouts found")
        })

    })

    describe("Adding Goal Functions", function () {  
        //Testing default goal constructor, defaults to today
        test("Goal constructor works with default parameter", function () {
            let goal = new Goal("Swim the Thames",150,7,"Swim")
            expect(
                goal.name
            ).toBe("Swim the Thames")
        })
        
        test("Goal name correct after add", function () {
            expect(
                aGoal.name
            ).toBe("Complete 10 workouts over 30 minutes")
        })

        test("Goal date correct after add", function () {
            expect(
                
                aGoal.date
            ).toEqual(new Date(2020,4,3))
        })

        test("Goal id correct after add", function () {
            expect(
                aGoal.id
            ).toEqual(0)
        })
    })

    describe("Remove Goal Functions", function () {
        //removing added goal
        beforeEach(() => {
            aUser.removeGoal(0)
        })
        
        test("Goal is removed from goal list", function () {
            expect(
                aUser.allMyGoals
            ).toEqual([])
            
        })

        test("goalCount is zero after removal", function () {
            expect(
                aUser.totalGoalCount
            ).toBe(0)
        })

        test("Adding Invalid Id for Removal - should return failure message", function () {
            expect(
                aUser.removeGoal(576)
            ).toBe("576 could not be found on the list")
        })

    })

    describe("Updating Goal Functions", function () {  
        //Updating an added goal
        beforeEach(() => {
            aUser.updateGoal(0,"Swim to North Island",7,150,new Date(2024,3,5))
            aGoal = aUser.allMyGoals[0]
        })

        test("Goal name correctly changes on update", function () {
            expect(
                aGoal.name
            ).toBe("Swim to North Island")
        })

        test("Goal date correctly changes on update", function () {
            expect(
                aGoal.date
            ).toEqual(new Date(2024,3,5))
        })

        test("Update Invalid Goal - should return failure message", function () {
            expect(
                aUser.updateGoal(8)
            ).toBe("The Goal could not be found on the list")
        })

        describe("Reverting Goal Functions", function () {  
            //Reverting the changes made to the goal
            beforeEach(() => {
                aUser.revertGoal(0)
                aUser.revertGoal(0)
                aGoal = aUser.allMyGoals[0]
            })
    
            test("Goal name correctly updates on revert", function () {
                expect(
                    aGoal.name
                ).toBe("Complete 10 workouts over 30 minutes")
            })
    
            test("Goal date correctly updates on revert", function () {
                expect(
                    aGoal.date
                ).toEqual(new Date(2020,4,3))
            })

            test("Revert Invalid Goal - should return failure message", function () {
                expect(
                    aUser.revertGoal(56)
                ).toBe("The Goal Could not be Reverted")
            })
        })
    })

    describe("Goals correctly add to list", function () {  
        //adding sample goals for updating
        beforeEach(() => {
            aUser.addGoal("Complete 8 Workouts",1000,8,"Run")
            aUser.addGoal("Complete 7 Workouts",1000,7,"Run")
            aUser.addGoal("Complete 6 Workouts",1000,6,"Run")
            aUser.addGoal("Complete 5 Workouts",1000,5,"Run")
            aUser.addGoal("Complete 4 Workouts",1000,4,"Run")
            aUser.addGoal("Complete 3 Workouts",1000,3,"Run")
        })

        test("All Goals Returned", function () {
            let allGoals = aUser.returnAllGoals()
            expect(
                allGoals.length
            ).toEqual(7)
        })

        describe("Find Goal", function () {
            test("Expect Goal to be Found", function () {
                expect(
                    aUser.findGoal(1).name
                ).toBe("Complete 8 Workouts")
            })
        })
    })

    describe("Goal Completion Features", function () {  
        //adding progress towards goals
        beforeEach(() => {
            aUser.addGoal("Complete 8 Workouts",1000,8,"Run")
            aUser.addGoal("Complete 160 Minutes of Workouts",160,20,"Run")
            aUser.addWorkout("Run",20)
            aUser.addWorkout("Run",20)
            aUser.addWorkout("Run",20)
            aUser.addWorkout("Run",20)
            aUser.addWorkout("Run",20)
            aUser.addWorkout("Run",20)
            aUser.addWorkout("Run",20)
            aUser.addWorkout("Run",20)
        })

        test("Goal Requirements Set Correctly", function () {
            expect(
                aUser.allMyGoals[1].amountRequirement
            ).toEqual(8)
        })

        test("Goal Requirements Invalid ID", function () {
            expect(
                aUser.setGoalRequirement(1000,8,"Run",8)
            ).toEqual("An invalid goal id has been entered")
        })

        test("Goal Requirements Set Valid Goal", function () {
            aUser.setGoalRequirement(1300,8,"Run",1)
            expect(
                aUser.findGoal(1).timeRequirement
            ).toEqual(1300)
        })

        test("Goal 2 Complete After 8 Workouts", function () {
            aUser.allMyGoals[1].checkForGoalCompletion()
            expect(
                aUser.allMyGoals[1].goalComplete
            ).toEqual(true)
        })

        test("Goal 3 Complete After 160 Minutes", function () {
            aUser.allMyGoals[2].checkForGoalCompletion()
            expect(
                aUser.allMyGoals[2].goalComplete
            ).toEqual(true)
        })

        test("Goal still Incomplete", function () {
            aUser.allMyGoals[0].checkForGoalCompletion()
            expect(
                aUser.allMyGoals[1].goalComplete
            ).toEqual(false)
        })


    })

    describe('localStorage Tests', () => {
        beforeAll(() => {
          Object.defineProperty(window, 'localStorage', {
            value: fakeLocalStorage,
          });
        });
      
        test('User saves to localStorage', () => {
          aUser.updateLocalStorage();
          expect(window.localStorage.getItem('1')).toEqual("{\"id\":1,\"firstName\":\"Hamish\",\"lastName\":\"Cleland\",\"allMyWorkouts\":[{\"type\":\"Bike\",\"lengthTime\":45,\"date\":\"2021-04-05T12:00:00.000Z\",\"editNum\":0,\"id\":0}],\"allMyEditedWorkouts\":[],\"totalWorkoutCount\":1,\"allMyGoals\":[{\"name\":\"Complete 10 workouts over 30 minutes\",\"timeRequirement\":10,\"amountRequirement\":30,\"numberOfWorkouts\":0,\"numberOfMinutes\":0,\"workoutType\":\"Run\",\"date\":\"2020-05-02T12:00:00.000Z\",\"editNum\":0,\"goalComplete\":false,\"id\":0}],\"allMyEditedGoals\":[],\"totalGoalCount\":1}");
          });
      
        test('Triathlon saves to localStorage', () => {
            theTriathlon.saveToLocalStorage()
            expect(window.localStorage.getItem('theTriathlon')).toEqual("{\"userList\":[{\"id\":1,\"firstName\":\"Hamish\",\"lastName\":\"Cleland\",\"allMyWorkouts\":[{\"type\":\"Bike\",\"lengthTime\":45,\"date\":\"2021-04-05T12:00:00.000Z\",\"editNum\":0,\"id\":0}],\"allMyEditedWorkouts\":[],\"totalWorkoutCount\":1,\"allMyGoals\":[{\"name\":\"Complete 10 workouts over 30 minutes\",\"timeRequirement\":10,\"amountRequirement\":30,\"numberOfWorkouts\":0,\"numberOfMinutes\":0,\"workoutType\":\"Run\",\"date\":\"2020-05-02T12:00:00.000Z\",\"editNum\":0,\"goalComplete\":false,\"id\":0}],\"allMyEditedGoals\":[],\"totalGoalCount\":1}],\"userCount\":1}");
            });
    
        test('Triathlon can be loaded from localStorage', () => {
            aUser.addWorkout("Bike", 200)
            aUser.updateWorkout(1,90,"Bike")
            aUser.updateWorkout(1,120,"Bike")
            aUser.revertWorkout(1)
            aUser.addGoal("Train for NBA Finals", 1000, 40, "Run")
            aUser.updateGoal(1,"Win NBA Finals", 1200, 50, "Run")
            aUser.updateGoal(1,"Train for Next Season", 2000, 60, "Run")
            aUser.revertGoal(1)
            theTriathlon.saveToLocalStorage()
            let anotherTriathlon = new Triathlon()
            anotherTriathlon.loadFromLocalStorage()
            expect(anotherTriathlon.userList[0].firstName).toBe("Hamish");
            expect(anotherTriathlon.userList[0].allMyGoals[0].name).toBe("Complete 10 workouts over 30 minutes");
            expect(anotherTriathlon.userList[0].allMyWorkouts[1].lengthTime).toBe(90)
            expect(anotherTriathlon.userList[0].allMyGoals[1].name).toBe("Win NBA Finals")
            });
    })

    describe("Array Tests", function () {
        beforeEach(() => {
            aUser.addWorkout("Bike",35,new Date(2010,3,6))
            aUser.addWorkout("Bike",55,new Date(2011,3,6))
            aUser.addWorkout("Run",30,new Date(2009,3,6))
            aUser.addWorkout("Run",40,new Date(2016,3,6))
            aUser.addWorkout("Run",50,new Date(2015,3,6))
            aUser.addWorkout("Swim",60,new Date(2014,3,6))
            aUser.addWorkout("Swim",70,new Date(2013,3,6))
            aUser.addWorkout("Swim",80,new Date(2012,3,6))
            aUser.addGoal("Test Goal1",10,10,"Run",new Date(2015,3,6))
            aUser.addGoal("Test Goal2",10,10,"Run",new Date(2014,3,6))
            aUser.addGoal("Test Goal3",10,10,"Run",new Date(2013,3,6))
            aUser.addGoal("Test Goal4",10,10,"Run",new Date(2012,3,6))
            aUser.addGoal("Test Goal5",10,10,"Run",new Date(2016,3,6))
            aUser.addGoal("Test Goal6",10,10,"Run",new Date(2017,3,6))
            aUser.addGoal("Test Goal7",10,10,"Run",new Date(2018,3,6))
        })

        test("Sort Workouts By Date - Check Lowest", function () {
            let sortTest = aUser.sortByDate("workouts")
            expect(
                sortTest[0].date
            ).toEqual(new Date(2009,3,6))
        })

        test("Sort Workouts By Date - Check Highest", function () {
            let sortTest = aUser.sortByDate("workouts")
            expect(
                sortTest[8].date
            ).toEqual(new Date(2021,3,6))
        })

        test("Sort Goals By Date - Check Lowest", function () {
            let sortTest = aUser.sortByDate("goals")
            expect(
                sortTest[0].date
            ).toEqual(new Date(2012,3,6))
        })

        test("Sort Goals By Date - Check Highest", function () {
            let sortTest = aUser.sortByDate("goals")
            expect(
                sortTest[6].date
            ).toEqual(new Date(2018,3,6))
        })
        
        test("Sort Workouts By Time - Check Lowest", function () {
            let sortTest = aUser.sortByTime()
            expect(
                sortTest[0].lengthTime
            ).toEqual(30)
        })

        test("Sort Workouts By Time - Check Highest", function () {
            let sortTest = aUser.sortByTime()
            expect(
                sortTest[8].lengthTime
            ).toEqual(80)
        })

        test("ReturnAllWorkouts sorts by Date", function () {
            let allWorkouts = aUser.returnAllWorkouts(true)
            expect(
                allWorkouts[0].id
            ).toEqual(3)
            expect(
                allWorkouts[8].id
            ).toEqual(0)
        })

        test("ReturnAllWorkouts sorts by Time", function () {
            let allWorkouts = aUser.returnAllWorkouts()
            expect(
                allWorkouts[0].id
            ).toEqual(3)
            expect(
                allWorkouts[8].id
            ).toEqual(8)
        })

        test("Find Items By Date - Workouts", function () {
            let result = aUser.findItemsByDate(true,false,new Date(2008,7,7), new Date(2014,7,7))
            expect(
                result.length
            ).toEqual(6)
        })

        test("Find Items By Date - Goals", function () {
            let result = aUser.findItemsByDate(false,true,new Date(2013,3,5), new Date(2016,4,6))
            expect(
                result.length
            ).toEqual(4)
        })

        test("Find Items By Date - Workouts and Goals", function () {
            let result = aUser.findItemsByDate(true,true,new Date(2008,3,5), new Date(2014,4,6))
            expect(
                result.length
            ).toEqual(9)
        })

        test("Find Items By Date - Workouts and Goals - No Date Range", function () {
            let result = aUser.findItemsByDate(true,true)
            expect(
                result.length
            ).toEqual(17)
        })

        test("Find Items By Date - double false Returns No Items", function () {
            let result = aUser.findItemsByDate(false,false,new Date(2008,3,5), new Date(2014,4,6))
            expect(
                result.length
            ).toEqual(0)
        })

        test("Find Workouts By Time - correct amount returned", function () {
            let result = aUser.findWorkoutByTime(55,75)
            expect(
                result.length
            ).toEqual(2)
        })

        test("Find Workouts By Time - correct lengthTime", function () {
            let result = aUser.findWorkoutByTime(55,75),resultArray
            expect(
                resultArray = [result[0].lengthTime,result[1].lengthTime]
            ).toEqual([60,70])
        })
    })
});