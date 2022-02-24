import _ from '@lodash';
import Card from '@material-ui/core/Card';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { memo, useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import '../../../../styles/dashboard.css';

function Widget5(props) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const data = _.merge({}, props.data);
  const series = data.series[Object.keys(data.series)[tabValue]];
  const [width, setWidth] = useState('99%');

  _.setWith(data, 'options.colors', [theme.palette.secondary.main, theme.palette.primary.main]);

  useEffect(() => {
    setWidth('100%');
  }, []);

  return (
    <Card className="w-full rounded-20 shadow">
      <div className="relative p-20 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <Typography className="h3 sm:h2 font-medium">{props.valueOfChart}</Typography>
        </div>
        <div className="flex flex-col">
          <Typography className="h4 font-medium">{props.current}</Typography>
        </div>
      </div>

      <div className="w-full h-200 sm:h-320 p-16 sm:pb-16">
        <ReactApexChart
          width={width}
          options={data.options}
          series={series}
          type={data.options.chart.type}
          height={data.options.chart.height}
        />
      </div>
    </Card>
  );
}

export default memo(Widget5);
