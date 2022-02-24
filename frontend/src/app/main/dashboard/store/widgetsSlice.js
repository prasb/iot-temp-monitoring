import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWidgets = createAsyncThunk('analyticsDashboardApp/widgets/getWidgets', async () => {
  const response = await axios.get('/api/analytics-dashboard-app/widgets');
  console.log(data);
  const data = await response.data;

  // console.log(analyticsDashboardAppDB)

  // const data = analyticsDashboardAppDB.widgets

  return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgetsEntities, selectById: selectWidgetById } =
  widgetsAdapter.getSelectors((state) => state.analyticsDashboardApp.widgets);

const widgetsSlice = createSlice({
  name: 'analyticsDashboardApp/widgets',
  initialState: widgetsAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getWidgets.fulfilled]: widgetsAdapter.setAll,
  },
});

export default widgetsSlice.reducer;
