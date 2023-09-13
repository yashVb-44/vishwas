export const editForm = (formId) => {
    return {
        type: "EDIT_FORM",
        payload: {
            data: formId
        }
    }
}