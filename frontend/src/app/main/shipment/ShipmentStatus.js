import _ from '@lodash';
import clsx from 'clsx';
import React from 'react';

export const shipmentStatuses = [
	{
		id: 1,
		name: 'PENDING',
		color: 'bg-orange text-white'
	},
	{
		id: 2,
		name: 'SCHEDULING',
		color: 'bg-blue text-white'
	},
	{
		id: 3,
		name: 'APPOINTMENT_MADE',
		color: 'bg-purple text-white'
	},
	{
		id: 4,
		name: 'DELIVERED',
		color: 'bg-green-700 text-white'
	},
];

function ShipmentStatus(props) {
	return (
		<div className={clsx('inline text-12 p-6 rounded truncate', _.find(shipmentStatuses, { name: props.name }).color)}>
			{props.name}
		</div>
    );
}

export default ShipmentStatus;
