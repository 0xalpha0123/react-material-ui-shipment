import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const server_url = "http://localhost:3500";

export const getShipments = createAsyncThunk('shipments/getShipments', async () => {
	const response = await axios.get(`${server_url}/api/getshipments`);
	const data = await response.data;
	return { data };
});

export const addShipment = createAsyncThunk(
	'shipments/addShipment',
	async (shipment, { dispatch, getState }) => {
		const response = await axios.post(`${server_url}/api/addshipment`, { shipment });
		const data = await response.data;
		dispatch(getShipments());

		return data;
	}
);

export const updateShipment = createAsyncThunk(
	'shipments/updateShipment',
	async (shipment, { dispatch, getState }) => {
		const response = await axios.post(`${server_url}/api/updateshipment`, { shipment });
		const data = await response.data;

		dispatch(getShipments());

		return data;
	}
);

export const removeShipment = createAsyncThunk(
	'shipments/removeShipment',
	async (shipmentId, { dispatch, getState }) => {
		const response = await axios.post(`${server_url}/api/removeshipment`, { id: shipmentId });
		const data = await response.data;
		dispatch(getShipments());
		return data;
	}
);

// export const removeShipments = createAsyncThunk(
// 	'shipments/removeShipments',
// 	async (shipmentIds, { dispatch, getState }) => {
// 		const response = await axios.post(`${server_url}/api/removeshipments`, { shipmentIds });
// 		const data = await response.data;

// 		dispatch(getShipments());

// 		return data;
// 	}
// );

const shipmentsAdapter = createEntityAdapter({});

export const { selectAll: selectShipments, selectById: selectShipmentsById } = shipmentsAdapter.getSelectors(
	state => state.shipment.shipments
);

const shipmentsSlice = createSlice({
	name: 'shipment/shipments',
	initialState: shipmentsAdapter.getInitialState({
		shipmentDialog: {
			type: 'new',
			props: {
				open: false
			},
		},
		data: [],
		selected: {},
	}),
	reducers: {
		openNewShipmentDialog: (state, action) => {
			state.shipmentDialog = {
				type: 'new',
				props: {
					open: true
				},
			};
		},
		closeNewShipmentDialog: (state, action) => {
			state.shipmentDialog = {
				type: 'new',
				props: {
					open: false
				},
			};
		},
		selectRow: (state, action) => {
			state.selected = action.payload;
		}
	},
	extraReducers: {
		[updateShipment.fulfilled]: shipmentsAdapter.upsertOne,
		[removeShipment.fulfilled]: shipmentsAdapter.removeOne,
		[addShipment.fulfilled]: shipmentsAdapter.addOne,
		[getShipments.fulfilled]: (state, action) => {
			state.data = action.payload.data
		}
		// {
		// 	shipmentsAdapter.setAll(state, action.payload)
		// }
	}
});

export const {
	openNewShipmentDialog,
	closeNewShipmentDialog,
	selectRow,
} = shipmentsSlice.actions;

export default shipmentsSlice.reducer;
