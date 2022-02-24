import FusePageCardedDashboard from '@fuse/core/FusePageCarded/FusePageCardedDashboard';
import { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import AnalyticsDashboardApp from './AnalyticsDashboardApp';

function Dashboard(props) {
  // , {value : "Device 2", id : "device2"}, {value : "Device 3", id : "device3"}, {value : "Device 4", id : "device4"}

  const categories = [{ value: 'Device 1', id: 'device1' }];

  const [selectedCategory, setSelectedCategory] = useState('all');

  function handleSelectedCategory(event) {
    setSelectedCategory(event.target.value);
  }

  return (
    <FusePageCardedDashboard
      classes={{
        toolbar: 'p-0',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={
        <DashboardHeader
          categories={categories}
          selectedCategory={selectedCategory}
          handleSelectedCategory={handleSelectedCategory}
        />
      }
      content={<AnalyticsDashboardApp selectedCategory={selectedCategory} />}
      innerScroll
    />
  );
}

export default Dashboard;
