import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: !!localStorage.getItem("userData"),
    userData: JSON.parse(localStorage.getItem("userData")) || null,
};

const trackAuthSlice = createSlice({
    name : "trackAuth",
    initialState,
    reducers:{
        login : (state,action)=>{

            state.status = true ;
            state.userData = action.payload
            
        },
        logout : (state)=>{
            state.status = false,
            state.userData = null
            localStorage.removeItem("userData"); 
        }
    } 
})

export const{login,logout} = trackAuthSlice.actions
export default trackAuthSlice.reducer