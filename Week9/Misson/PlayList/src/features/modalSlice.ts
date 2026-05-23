import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface modalState{
    isOpen : boolean
}

const initialState : modalState = {
    isOpen : false,
}

const modalSlice = createSlice({
    name : 'modal',
    initialState,
    reducers : {
        openModal (state){
            state.isOpen = true;
        },
        closeModal(state){
            state.isOpen = false;
        }
    }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;