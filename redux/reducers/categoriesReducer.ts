import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
    categories: any[]
    categoriesSearch: any[],
    isLastPage: boolean,
    categorybyId: null,
    lastDoc: any
}

const initialState: initialStateType = {
    categories: [],
    categoriesSearch: [],
    isLastPage: false,
    categorybyId: null,
    lastDoc: null
}
export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setcategories(state, action: PayloadAction<any[]>) {
            state.categories = action.payload
        },
        setIsLastPage(state, action: PayloadAction<boolean>) {
            state.isLastPage = action.payload;
        },
        getCategoryById(state, action: PayloadAction<string>) {
            const category = state.categories.find((category) => {
                return category.id === action.payload
            })
            return { ...state, categorybyId: category }
        },
        addCategory(state, action: PayloadAction<any>) {
            state.categories.push(action.payload)
        },
        updateCategory(state, action: PayloadAction<any>) {
            const index = state.categories.findIndex(category => category.id === action.payload.id)
            state.categories[index] = action.payload
        },
        deleteCategory(state, action: PayloadAction<any>) {
            state.categories = state.categories.filter(category => category.id !== action.payload)
        },
        setLastDoc(state, action: PayloadAction<any>) {
            state.lastDoc = action.payload
        }
    }
})

export const { setcategories,
    setIsLastPage,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    setLastDoc
} = categoriesSlice.actions
