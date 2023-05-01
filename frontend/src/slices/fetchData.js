import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

import { apiRoutes } from '../routes/routes.js';

const fetchData = createAsyncThunk(
  'fetchData',
  async (header) => {
    const res = await axios.get(apiRoutes.dataPath(), { headers: header });

    return res.data;
  },
);

export default fetchData;
