// Controller

import Triathlon from "../model/triathlon";
import React from "react";
import ReactDOM from "react-dom";

let theTriathlon = new(Triathlon)
let existingData = false
let currentUser
if (localStorage.getItem("theTriathlon") != null) {
    theTriathlon.loadFromLocalStorage()
    existingData = true
}

function DisplayContent() {
        const [state, setState] = React.useState({
            firstName: "Joe",
            lastName: "Smith",
            isSubmitted: false
          })
    
    const handleChangeUser = (event) => {
        const value = event.target.value;
            setState({
            ...state,
            [event.target.name]: value
        });
      }

    const handleSubmitUser = (event) => {
        event.preventDefault();
        alert(`Welcome  ${state.firstName} ${state.lastName}!`)
        existingData = true
        theTriathlon.addUser(state.firstName,state.lastName)
        setState({
            firstName: state.firstName,
            lastName: state.lastName,
            isSubmitted: true
          })
          theTriathlon.saveToLocalStorage()
        }

    
    if (state.isSubmitted || existingData === true) {
        currentUser = theTriathlon.findUser(1)
        return (
        <div id = "appContent">
                <div id="headerContainer">
                    <div id="imgContainer">
                        <img src="img/triathlon.svg" id="triathlon"></img>
                    </div>
                    <div id="infoContainer">
                        <h1>Welcome!</h1>
                        <h1>{state.firstName} {state.lastName}</h1>
                    </div>
                </div>
                <div id="main">
                    <TriathlonFunctions />
                </div>
        </div>
      )
    } else {
        return(
            <div id = "appContent">
                <div id="headerContainer">
                    <div id="imgContainer">
                        <img src="img/triathlon.svg" id="triathlon"></img>
                    </div>
                    <div id="infoContainer">
                        <h1>Hi There!</h1>
                        <h1>What is Your Name?</h1>
                    </div>
                </div>
                <div id="main">
                    <form onSubmit={handleSubmitUser}>
                        <label>Enter your first name:
                        <input 
                        type="text" 
                        name="firstName"
                        value={state.firstName}
                        onChange={handleChangeUser}
                    />
                    </label><br />
                    <label>Enter your last name:
                        <input 
                        type="text"
                        name="lastName" 
                        value={state.lastName}
                        onChange={handleChangeUser}
                    />
                    </label>
                    <input type="submit" />
                    </form>
                </div>
            </div>
        )
    }
  }

  function TriathlonFunctions() {
    const [state, setState] = React.useState({
        addExercise: false,
        addGoal: false,
        sortDate: true
      })

    const handleAddExercise = (event) => {
        event.preventDefault();
        setState({
            addExercise: true
          })
    }

    const handleAddGoal = (event) => {
        event.preventDefault();
        setState({
            addGoal: true
          })
    }

    const handleSortDate = (event) => {
        event.preventDefault();
        setState({
            sortDate: true,
          })
    }

    const handleSortTime = (event) => {
        event.preventDefault();
        setState({
            sortDate: false
          })
    }

       if (state.addExercise) {
        return (
            <AddExercise />
        )
       } else if (state.addGoal) {
        return (
            <AddGoal />
        )
       }
       return (
            <div>
                <div id="exerciseFunctions">
                        <button type="button" onClick={handleAddExercise}>Add Exercise</button>
                </div>
                <br />
                <div id="goalFunctions">
                        <button type="button" onClick={handleAddGoal}>Add Goal</button>
                </div>
                <div id="exerciseSorting">
                <div>
                    <br />
                    <button type="button" class="goals" onClick={handleSortDate} >Sort by Date</button>
                    <button type="button" class="goals" onClick={handleSortTime}>Sort by Time</button>
                </div>
                </div>
                <div>
                    <FindExercise />
                </div>
                <div id="exercises">
                    <DisplayExercises sorting={state.sortDate}/>
                </div>
                <div id = "goals">
                    <DisplayGoals />
                </div>
            </div>
        )
  }

  function DisplayExercises(prop) {

    let targetRow = 0

    let targetExercise
    
    const [state, setState] = React.useState({
        removeExercise: false,
        modifyExercise: false,
        revertExercise: false,
        newLength: 30,
        newType: "",
        newDate: new Date(),
        totalExercises: 0
      })

    const handleUpdateExercise = (event) => {
        event.preventDefault();
        targetRow = event.target.getAttribute('a-key')
        targetExercise = currentUser.findWorkout(targetRow)
        setState({
            modifyExercise: true,
            newLength: targetExercise.lengthTime,
            newType: targetExercise.type,
            newDate: targetExercise.date
          })
    }

    const handleRevertExercise = (event) => {
        event.preventDefault();
        targetRow = event.target.getAttribute('a-key')
        currentUser.revertWorkout(targetRow)
        setState({
            revertExercise: true
          })
    }

    const handleRemoveExercise = (event) => {
        event.preventDefault();
        targetRow = event.target.getAttribute('a-key')
        currentUser.removeWorkout(targetRow)
        setState({
            removeExercise: true,
            totalExercises: currentUser.returnAllWorkouts().length
          })
    }

    const handleFieldChange = (event) => {
        const value = event.target.value;
            setState({
            ...state,
            [event.target.name]: value
        });
      }

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`You have updated the exercise to be ${state.newType} exercise of ${state.newLength} minutes on ${state.newDate}`)
        setState({
            newType: state.newType,
            newLength: state.newLength,
            newDate: state.newDate,
            modifyExercise: false
          })
        currentUser.updateWorkout(targetRow ,state.newLength, state.newType, state.newDate)
        }
        let exerciseList
        exerciseList = currentUser.returnAllWorkouts(prop.sorting)
        theTriathlon.saveToLocalStorage()
    if (state.modifyExercise) {
        let aExercise = currentUser.findWorkout(targetRow)
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Enter the exercise length:
                    <input 
                    type="number" 
                    name="newLength"
                    value={state.newLength}
                    onChange={handleFieldChange}
                />
                </label><br />
                <label>Enter the date:
                    <input 
                    type="date"
                    name="newDate"
                    value={state.newDate}
                    onChange={handleFieldChange}
                />
                </label>
                <div className="radio">
                        <label>
                        <input
                        type="radio"
                        value="Swim"
                        name="newType"
                        checked={state.newType === "Swim"}
                        onChange={handleFieldChange}
                        />
                        Swim
                    </label>
                </div>
                <div className="radio">
                    <label>
                    <input
                    type="radio"
                    value="Bike"
                    name="newType"
                    checked={state.newType === "Bike"}
                    onChange={handleFieldChange}
                    />
                    Bike
                </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                        type="radio"
                        value="Run"
                        name="newType"
                        checked={state.newType === "Run"}
                        onChange={handleFieldChange}
                        />
                        Run
                    </label>
                </div>
                <input type="submit" />
                </form>
            </div>
        )
    } else {
        state.removeExercise = false
        state.revertExercise = false
        return(
            <div>
                <h1>Workouts</h1>
                <table>
                    <thead>
                        <tr>
                        <th>Type</th>
                        <th>Length</th>
                        <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exerciseList.map(item => {
                        return (
                            <tr key={item.id}>
                                <td>{ item.type }</td>
                                <td>{ item.lengthTime }</td>
                                <td>{ item.date }</td>
                                <td><button type="button" class="options" a-key={item.id} onClick={handleUpdateExercise}>Edit</button></td>
                                <td><button type="button" class="options" a-key={item.id}  onClick={handleRevertExercise}>Revert</button></td>
                                <td><button type="button" class="options" a-key={item.id} onClick={handleRemoveExercise}>Remove</button></td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
                <div id = "stats" >
                    <DisplayExerciseStats />
                </div>
            </div>
        )
    }
  }

  function FindExercise() {
    const [state, setState] = React.useState({
        minDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().substring(0, 10),
        maxDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().substring(0, 10),
        numberResults: 0,
        isSubmitted: false
      })

const handleChange= (event) => {
    const value = event.target.value;
        setState({
        ...state,
        [event.target.name]: value
    });
  }

const backButton= (event) => {
        setState({
        numberResults: 0
    });
  }

const handleSubmitUser = (event) => {
    event.preventDefault();
    let length = currentUser.findItemsByDate(true,false,state.minDate,state.maxDate).length
    alert (`You found ${length} items`)
    setState({
        minDate: state.minDate,
        maxDate: state.maxDate,
        isSubmitted: true,
        numberResults: length
      })
      theTriathlon.saveToLocalStorage()
    }

if (state.numberResults === 0) {
    return(
        <div id = "findWorkout">
                <form onSubmit={handleSubmitUser}>
                    <label>Enter Min Date
                    <input 
                    type="date" 
                    name="minDate"
                    value={state.minDate}
                    onChange={handleChange}
                />
                </label><br />
                <label>Enter Max Date
                    <input 
                    type="date"
                    name="maxDate" 
                    value={state.maxDate}
                    onChange={handleChange}
                />
                </label>
                <input type="submit" />
                </form>
        </div>
    )
} else { return (
    <div>
        <table>
        <thead>
            <tr>
            <th>Type</th>
            <th>Length</th>
            <th>Date</th>
            </tr>
        </thead>
        <tbody>
            {currentUser.findItemsByDate(true,false,state.minDate,state.maxDate).map( thing => {
            return (
                <tr key={thing.id}>
                    <td>{ thing.type }</td>
                    <td>{ thing.lengthTime }</td>
                    <td>{ thing.date }</td>
                </tr>
            );
            })}
            <button onClick={backButton}>Back</button>
        </tbody>
    </table>
    </div>
    
)
}
}

  function DisplayExerciseStats() {
    const [state, setState] = React.useState({
        aveSwimLength: currentUser.calculateAverageWorkoutLength(false,true,false),
        aveBikeLength: currentUser.calculateAverageWorkoutLength(true,false,false),
        aveRunLength: currentUser.calculateAverageWorkoutLength(false,false,true),
        aveTotalLength: currentUser.calculateAverageWorkoutLength(true,true,true)
      })
    let returnString1 = ""
    let returnString2 = ""
    let returnString3 = ""
    let returnString4 = ""
    if (state.aveSwimLength > 0) {
        returnString1 += `🏊 Your Swim Workout Length is ${state.aveSwimLength} Minutes!`
    }
    if (state.aveBikeLength > 0) {
        returnString2 += `🚴 Your Bike Workout Length is ${state.aveBikeLength} Minutes!`
    }
    if (state.aveRunLength > 0) {
        returnString3 += `🏃 Your Run Workout Length is ${state.aveRunLength} Minutes!`
    }
    if (state.aveTotalLength > 0) {
        returnString4 += `🏋 Your Average Combined Workout Length is ${state.aveTotalLength} Minutes!`
    }
    return (
        <div id="returnedStats">
            <h2>{returnString1}</h2>
            <h2>{returnString2}</h2>
            <h2>{returnString3}</h2>
            <h2 id = "totalAverage">{returnString4}</h2>
        </div>
    )
  }
    

  function DisplayGoals() {

    let targetRow = 0

    let targetGoal
    
    const [state, setState] = React.useState({
        removeGoal: false,
        updateGoal: false,
        revertGoal: false,
        newGoalName: "",
        newTimeRequired: 0,
        newAmountRequired: 0,
        newDate: new Date()
      })

    const handleUpdateGoal = (event) => {
        event.preventDefault();
        targetRow = event.target.getAttribute('b-key')
        targetGoal = currentUser.findGoal(targetRow)
        setState({
            updateGoal: true,
            newGoalName: targetGoal.name,
            newTimeRequired: targetGoal.timeRequirement,
            newAmountRequired: targetGoal.amountRequirement,
            newDate: targetGoal.date
          })
        }
    
    const handleRemoveGoal = (event) => {
        event.preventDefault();
        targetRow = event.target.getAttribute('b-key')
        currentUser.removeGoal(targetRow)
        setState({
            removeExercise: true
            })
        
    }

    const handleRevertGoal = (event) => {
        event.preventDefault();
        targetRow = event.target.getAttribute('b-key')
        currentUser.revertGoal(targetRow)
        setState({
            revertGoal: true
          })
    }

    const handleFieldChange = (event) => {
        const value = event.target.value;
            setState({
            ...state,
            [event.target.name]: value
        });
        }
    
    const backButton = (event) => {
        setState({
        isSubmitted: true
    });
      }

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`You have updated the goal!`)
        setState({
            newGoalName: state.newGoalName,
            newTimeRequired: state.newTimeRequired,
            newAmountRequired: state.newAmountRequired,
            newDate: state.newDate,
            updateGoal: false
            })
            theTriathlon.saveToLocalStorage()
        currentUser.updateGoal(targetRow ,state.newGoalName, state.newTimeRequired, state.newAmountRequired, state.newDate)
        }

    let goalList = currentUser.returnAllGoals()
    theTriathlon.saveToLocalStorage()

    if (state.updateGoal) {
        let aGoal = currentUser.findGoal(targetRow)
        return (
            <div>
                    <form onSubmit={handleSubmit}>
                        <label>Enter the Goal Name:
                        <input 
                        type="text" 
                        name="newGoalName"
                        value={state.newGoalName}
                        onChange={handleFieldChange}
                    />
                    </label><br />
                    <label>Enter the Amount of Exercise Time to Meet Goal:
                        <input 
                        type="number" 
                        name="newTimeRequired" 
                        value={state.newTimeRequired}
                        onChange={handleFieldChange}
                    />
                    </label><br />
                    <label>Enter the Amount of Exercises to Meet Goal:
                        <input 
                        type="number" 
                        name="newAmountRequired" 
                        value={state.newAmountRequired}
                        onChange={handleFieldChange}
                    />
                    </label><br />
                    <label>Enter the Date for Completion:
                        <input 
                        type="date"
                        name="newDate" 
                        value={state.newDate}
                        onChange={handleFieldChange}
                    />
                    </label>
                    <input type="submit" />
                    <button onClick={backButton}>Back</button>
                    </form>
                </div>
            )
        } else {
            state.removeGoal = false
            state.revertGoal = false
            return(
            <div>
                        <h1>Goals</h1>
                        <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Time Required</th>
                            <th>Amount Required</th>
                            <th>Number of Workouts</th>
                            <th>Number of Minutes</th>
                            <th>Workout Type</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goalList.map(goal => {
                        return (
                            <tr key={goal.id}>
                                <td>{ goal.name }</td>
                                <td>{ goal.timeRequirement }</td>
                                <td>{ goal.amountRequirement }</td>
                                <td>{ goal.numberOfWorkouts }</td>
                                <td>{ goal.numberOfMinutes }</td>
                                <td>{ goal.workoutType }</td>
                                <td>{ goal.date}</td>
                                <td><button type="button" class="goals" b-key={goal.id} onClick={handleUpdateGoal}>Edit</button></td>
                                <td><button type="button" class="goals" b-key={goal.id} onClick={handleRevertGoal}>Revert</button></td>
                                <td><button type="button" class="goals" b-key={goal.id} onClick={handleRemoveGoal}>Remove</button></td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
  }

  function AddExercise() {
    const [state, setState] = React.useState({
        type: "Swim",
        length: 30,
        date: new Date().toISOString().substring(0, 10),
        isSubmitted: false
      })

const handleFieldChange = (event) => {
    const value = event.target.value;
        setState({
        ...state,
        [event.target.name]: value
    });
  }

  const backButton = (event) => {
        setState({
        isSubmitted: true
    });
  }

const handleSubmit = (event) => {
    event.preventDefault();
    alert(`You did an ${state.type} exercise of ${state.length} minutes on ${state.date}`)
    currentUser.addWorkout(state.type,state.length,state.date)
    setState({
        type: state.type,
        length: state.length,
        date: state.date,
        isSubmitted: true
      })
      theTriathlon.saveToLocalStorage()
    }

if (state.isSubmitted === false) {
        return(
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Enter the exercise length:
                    <input 
                    type="number" 
                    name="length"
                    value={state.length}
                    onChange={handleFieldChange}
                />
                </label><br />
                <label>Enter the date:
                    <input 
                    type="date"
                    name="date"
                    value={state.date}
                    onChange={handleFieldChange}
                />
                </label>
                <div className="radio">
                        <label>
                        <input
                        type="radio"
                        value="Swim"
                        name="type"
                        onChange={handleFieldChange}
                        checked={state.type === "Swim"}
                        />
                        Swim
                    </label>
                </div>
                <div className="radio">
                    <label>
                    <input
                    type="radio"
                    value="Bike"
                    name="type"
                    onChange={handleFieldChange}
                    checked={state.type === "Bike"}
                    />
                    Bike
                </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                        type="radio"
                        value="Run"
                        name="type"
                        onChange={handleFieldChange}
                        checked={state.type === "Run"}
                        />
                        Run
                    </label>
                </div>
                <input type="submit" />
                <button onClick={backButton}>Back</button>
                </form>
            </div>
        ) } else {
            return (
            <TriathlonFunctions />
            )
        }
    }

    function AddGoal() {
        const [state, setState] = React.useState({
            goalName: "Complete 5 Workouts",
            timeRequirement: 200,
            amountRequirement: 5,
            type: "Swim",
            date: new Date().toISOString().substring(0, 10),
            isSubmitted: false
          })
    
    const handleFieldChange = (event) => {
        const value = event.target.value;
            setState({
            ...state,
            [event.target.name]: value
        });
      }
      
    const backButton = (event) => {
        setState({
        isSubmitted: true
    });
  }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`You added a goal!`)
        currentUser.addGoal(state.goalName, state.timeRequirement, state.amountRequirement, state.type, state.date)
        setState({
            goalName: state.goalName,
            timeRequirement: state.timeRequirement,
            amountRequirement: state.amountRequirement,
            type: state.type,
            date: state.date,
            isSubmitted: true
          })
          theTriathlon.saveToLocalStorage()
        }
    
    if (state.isSubmitted === false) {
            return(
                <div>
                    <form onSubmit={handleSubmit}>
                        <label>Enter the Goal Name:
                        <input 
                        type="text" 
                        name="goalName"
                        value={state.goalName}
                        onChange={handleFieldChange}
                    />
                    </label><br />
                    <label>Enter the Amount of Exercise Time to Meet Goal:
                        <input 
                        type="number" 
                        name="timeRequirement" 
                        value={state.timeRequirement}
                        onChange={handleFieldChange}
                    />
                    </label><br />
                    <label>Enter the Amount of Exercises to Meet Goal:
                        <input 
                        type="number" 
                        name="amountRequirement" 
                        value={state.amountRequirement}
                        onChange={handleFieldChange}
                    />
                    </label><br />
                    <label>Enter the Date for Completion:
                        <input 
                        type="date"
                        name="date" 
                        value={state.date}
                        onChange={handleFieldChange}
                    />
                    </label>
                    <div className="radio">
                            <label>
                            <input
                            type="radio"
                            value="Swim"
                            name="type"
                            checked={state.type === "Swim"}
                            onChange={handleFieldChange}
                            />
                            Swim
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                        <input
                        type="radio"
                        value="Bike"
                        name="type"
                        checked={state.type === "Bike"}
                        onChange={handleFieldChange}
                        />
                        Bike
                    </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input
                            type="radio"
                            value="Run"
                            name="type"
                            checked={state.type === "Run"}
                            onChange={handleFieldChange}
                            />
                            Run
                        </label>
                    </div>
                    <input type="submit" />
                    <button onClick={backButton}>Back</button>
                    </form>
                </div>
            ) } else {
                return (
                <TriathlonFunctions />
                )
            }
        }

const element = <DisplayContent />

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)
root.render(element)