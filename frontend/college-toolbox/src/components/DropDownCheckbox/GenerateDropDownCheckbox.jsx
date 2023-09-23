import React, { useState } from 'react';
import DropDownCheckbox from './DropDownCheckbox';

function Generate() {
  // Define the data for each dropdown
  const dropdownData = [
    {
      filterType: 'Type',
      data: ['Note taking', 'Budget Tracker', 'Planners', 'Studying'],
    },
    {
      filterType: 'Money',
      data: ['Fee', 'Membership', 'Single pay', 'Free trial'],
    },
    {
      filterType: 'Other',
      data: ['r', 'asdf', 'dfvb nf', 'kbfg ht'],
    },
  ];

  return (
    <div>
      {dropdownData.map((item, index) => (
        <DropDownCheckbox
          key={index}
          filterType={item.filterType}
					targetId={item.filterType + "=dropdown"}
          data={item.data}
        />
      ))}
    </div>
  );
}

export default Generate;
