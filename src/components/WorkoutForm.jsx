import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

const WorkoutForm = () => {
    const { dispatch } = useWorkoutsContext()
    const [formData, setFormData] = useState({
        title: "",
        load: "",
        reps: ""
    })

    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    function handleChange(event) {
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const {title, load, reps} = formData
        const workout = {title, load, reps}

        const response = await fetch('/api/workouts', {
            method: 'POST',
            body: JSON.stringify(workout),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        } else if (response.ok) {
            setError(null)
            setEmptyFields([])
            setFormData({
                title: "",
                load: "",
                reps: ""
            })
            dispatch({
                type: "CREATE_WORKOUT",
                payload: json
            })
        }
    }



    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Workout</h3>

            <label>Exercise Title:</label>
            <input 
                type="text"
                name="title"
                onChange={handleChange}
                value={formData.title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label>Load (in kg):</label>
            <input 
                type="number"
                name="load"
                onChange={handleChange}
                value={formData.load}
                className={emptyFields.includes('load') ? 'error' : ''}
            />
            <label>Reps:</label>
            <input 
                type="number"
                name="reps"
                onChange={handleChange}
                value={formData.reps}
                className={emptyFields.includes('reps') ? 'error' : ''}
            />

            <button>Add Workout</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default WorkoutForm