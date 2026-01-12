import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Submit bid
export const submitBid = createAsyncThunk('bids/submitBid', async (bidData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/bids', bidData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit bid');
  }
});

// Fetch bids for a gig (owner only)
export const fetchGigBids = createAsyncThunk('bids/fetchGigBids', async (gigId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/bids/${gigId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
  }
});

// Hire a freelancer
export const hireBid = createAsyncThunk('bids/hireBid', async (bidId, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/bids/${bidId}/hire`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer');
  }
});

// Fetch user's bids
export const fetchMyBids = createAsyncThunk('bids/fetchMyBids', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/bids/user/my-bids');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch your bids');
  }
});

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
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
      // Submit Bid
      .addCase(submitBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids.push(action.payload);
        state.error = null;
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Gig Bids
      .addCase(fetchGigBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGigBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids = action.payload;
        state.error = null;
      })
      .addCase(fetchGigBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Hire Bid
      .addCase(hireBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the hired bid and reject others
        state.bids = state.bids.map((bid) => {
          if (bid._id === action.payload._id) {
            return action.payload;
          }
          if (bid.status === 'pending') {
            return { ...bid, status: 'rejected' };
          }
          return bid;
        });
        state.error = null;
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch My Bids
      .addCase(fetchMyBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload;
        state.error = null;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bidSlice.actions;
export default bidSlice.reducer;
