import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null; 
  loading: boolean;
  error: string | null;
  token: string | null; 
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: any; 
  token: string;
}

// Initial state with explicit type
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  token: null,
};

// Thunk to handle user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("username", data.userName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirm_password", data.confirmPassword);

      if (data.profileImage) {
        formData.append("profile_image", data.profileImage);
      }

      const response = await fetch("https://test1.focal-x.com/api/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to handle user login
export const loginUser = createAsyncThunk<LoginResponse, LoginPayload>(
  "auth/loginUser",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await fetch("https://test1.focal-x.com/api/login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const responseData = await response.json();
      console.log("Login response:", responseData); // Log response to verify token

      // Save the token to localStorage
      localStorage.setItem("token", responseData.token);
      return responseData; // Ensure this includes user and token
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to handle user logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found!");
    }

    try {
      const response = await fetch("https://test1.focal-x.com/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Logout failed.");
      }

      localStorage.removeItem("token"); // Remove the token from storage
      return true; // Logout success
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout request failed.");
    }
  }
);

// Create the auth slice with explicit state typing
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Save user
        state.token = action.payload.token; // Save token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
export const { setToken } = authSlice.actions;
