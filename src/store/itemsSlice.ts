// itemsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Item {
  id: number;
  name: string;
  price: number; 
  image_url: string;
  added_at?: string; 
  updated_at?: string;  
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
  singleItem: Item | null; // New state to hold the fetched single item
  currentPage: number;
  itemsPerPage: number;
}
const initialState: ItemsState = {
  items: [],  
  loading: false,
  error: null,
  singleItem: null, // Initialize the single item state
  currentPage: 1,
  itemsPerPage: 10,
};

export const fetchSingleItem = createAsyncThunk(
  'items/fetchSingleItem',
  async (id: number) => {
    console.log("Fetching item with ID:", id);  // Debugging log
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    // Add the Authorization header to the request
    const response = await fetch(`https://test1.focal-x.com/api/items/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Include the token in the header
        'Accept': 'application/json',         // Ensure the API expects JSON responses
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch item:', response.status, response.statusText);  // Log the failure status
      throw new Error('Failed to fetch item');
    }
    
    const data = await response.json();
    console.log("Fetched item:", data);  // Debugging log
    return data;
  }
);



export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('https://test1.focal-x.com/api/items', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching items: ${response.status}`);
    }

    const data = await response.json();
    
    console.log("Fetched items:", data);
    
    return data;
  }
);

// Async thunk for updating an item
export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, updatedItem }: { id: number, updatedItem: any }) => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.put(
      `https://test1.focal-x.com/api/items/${id}`,
      updatedItem,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  }
);

// Async thunk for deleting an item
export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: number) => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      throw new Error('No token found');
    }

    await axios.delete(`https://test1.focal-x.com/api/items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include Authorization token
      },
    });
    return id; // Return id for deletion from state
  }
);


const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload); // Add the new item to the state
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchSingleItem.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchSingleItem.fulfilled, (state, action) => {
      state.singleItem = action.payload;  // This will set the fetched item
      state.loading = false;
      state.error = null;
    })
    
    .addCase(fetchSingleItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'An error occurred';
    })
          .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to delete item';
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        // Update the item in the state with the returned data
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item';
      });
  },
});

export default itemsSlice.reducer;
export const { addItem } = itemsSlice.actions; 
export const { setPage } = itemsSlice.actions;