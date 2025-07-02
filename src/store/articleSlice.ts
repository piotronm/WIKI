// src/store/articlesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchArticles } from '../api/articles';  // Your existing API call

export const loadArticles = createAsyncThunk('articles/load', async () => {
  const response = await fetchArticles();
  return response.data;
});

interface ArticlesState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  items: [],
  loading: false,
  error: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadArticles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load articles';
      });
  },
});

export default articlesSlice.reducer;
