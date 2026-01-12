import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Fetch all gigs
export const fetchGigs = createAsyncThunk('gigs/fetchGigs', async (search = '', { rejectWithValue }) => {
  try {
    const response = await axios.get(`/gigs?search=${search}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
  }
});

// Fetch single gig
export const fetchGigById = createAsyncThunk('gigs/fetchGigById', async (gigId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/gigs/${gigId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
  }
});

// Create gig
export const createGig = createAsyncThunk('gigs/createGig', async (gigData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/gigs', gigData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
  }
});

// Fetch user's gigs
export const fetchMyGigs = createAsyncThunk('gigs/fetchMyGigs', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/gigs/user/my-gigs');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gigs');
  }
});

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    myGigs: [],
    currentGig: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Gigs
      .addCase(fetchGigs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs = action.payload;
        state.error = null;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Gig By Id
      .addCase(fetchGigById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGigById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGig = action.payload;
        state.error = null;
      })
      .addCase(fetchGigById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Gig
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs.unshift(action.payload);
        state.error = null;
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch My Gigs
      .addCase(fetchMyGigs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGigs = action.payload;
        state.error = null;
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = gigSlice.actions;
export default gigSlice.reducer;
