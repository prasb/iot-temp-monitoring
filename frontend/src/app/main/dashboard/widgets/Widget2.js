import Card from '@material-ui/core/Card';
import { useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';

function Widget2(props) {
  const theme = useTheme();
  const data = _.merge({}, props.data);
  const [width, setWidth] = useState('99%');

  _.setWith(data, 'options.colors', [theme.palette.primary.main]);

  useEffect(() => {
    setWidth('100%');
  }, []);

  return (
    <Card className="w-full rounded-20 shadow">
      <div className="p-20 pb-0">
        <Typography className="h3 font-medium">Current Temperature</Typography>

        <div className="flex flex-row flex-wrap items-center mt-12">
          <Typography className="text-48 font-semibold leading-none tracking-tighter">
            {data.conversion.value}
          </Typography>
        </div>
        <div className="h-96 w-100-p" />
      </div>
    </Card>
  );
}

export default Widget2;
