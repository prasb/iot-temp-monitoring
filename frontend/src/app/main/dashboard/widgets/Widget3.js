import Card from '@material-ui/core/Card';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { memo, useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import _ from '@lodash';

function Widget3(props) {
  const theme = useTheme();
  const data = _.merge({}, props.data);
  const [width, setWidth] = useState('99%');

  _.setWith(data, 'options.colors', [theme.palette.secondary.main]);

  useEffect(() => {
    setWidth('100%');
  }, []);

  return (
    <Card className="w-full rounded-20 shadow">
      <div className="p-20 pb-0">
        <Typography className="h3 font-medium">Current Humidity</Typography>

        <div className="flex flex-row flex-wrap items-center mt-12">
          <Typography className="text-48 font-semibold leading-none tracking-tighter">
            {data.impressions.value}
          </Typography>
        </div>
        <div className="h-96 w-100-p"></div>
      </div>
    </Card>
  );
}

export default memo(Widget3);
