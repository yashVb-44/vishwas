const initialState = {
    payload: []
}


const FormDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_FORM":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default FormDataChange