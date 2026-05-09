import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'

import axiosInstance from '../../utils/axiosInstance'

const fetchRegisterUser = createAsyncThunk(
  'auth/fetchRegisterUser',
  async (regData, { rejectWithValue }) => {
    console.log(regData)
    try {
      const res = await axiosInstance.post('/user/register', regData)
      return res.data
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Ошибка при регистрации'
      return rejectWithValue(errorMsg)
    }
  },
)

const fetchLoginUser = createAsyncThunk(
  'auth/fetchLoginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/user/login', {
        email,
        password,
      })
      return res.data
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Ошибка при входе'
      return rejectWithValue(errorMsg)
    }
  },
)

const fetchLogoutUser = createAsyncThunk(
  'auth/fetchLogoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/user/logout')
      return res.data
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Ошибка при выходе'
      return rejectWithValue(errorMsg)
    }
  },
)

const fetchGetMe = createAsyncThunk(
  'auth/fetchGetMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/user/me')
      return res.data
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        'Ошибка при получении данных об авторизации'
      message.error(errorMsg)
      return rejectWithValue(errorMsg)
    }
  },
)

const initialState = {
  isLoading: true,
  isAdmin: false,
  user: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //register user
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.newUser
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      //login user
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload?.user
        state.isAdmin = action.payload?.user.isAdmin
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.error = action.payload
      })

      //logout user
      .addCase(fetchLogoutUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.isAdmin = false
        state.error = null
      })
      .addCase(fetchLogoutUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      //get me
      .addCase(fetchGetMe.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchGetMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload?.user
        state.isAdmin = action.payload?.user.isAdmin
      })
      .addCase(fetchGetMe.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.isAdmin = false
        state.error = action.payload
      })
  },
})
const checkIsAuth = (state) => Boolean(state.auth.user)
// export const {  } = authSlice.actions
export {
  fetchRegisterUser,
  fetchLoginUser,
  fetchGetMe,
  fetchLogoutUser,
  checkIsAuth,
}
export default authSlice.reducer
