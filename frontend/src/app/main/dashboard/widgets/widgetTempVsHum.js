import _ from '@lodash';
import Card from '@material-ui/core/Card';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { memo, useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import '../../../../styles/dashboard.css';

function TempVsHum(props) {
  const { series, keyTime, minVs, maxVs } = props;
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const data = _.merge({}, props.data);
  const options = useMemo(() => {
    return {
      colors: [theme.palette.secondary.main, theme.palette.primary.main],
      chart: {
        type: 'line',
        width: '100%',
        height: '100%',
        stacked: false,
        foreColor: '#999',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        width: 3,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        strokeColor: '#fff',
        strokeWidth: 3,
        strokeOpacity: 1,
        fillOpacity: 1,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories: keyTime,
        axisBorder: {
          show: false,
        },
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        min: minVs,
        max: maxVs,
        tickAmount: (maxVs - minVs) / 5,
        tooltip: {
          enabled: true,
        },
      },
      grid: {
        position: 'back',
      },
      legend: {
        show: false,
      },
      fill: {
        type: 'solid',
        opacity: 0.7,
      },
      tooltip: {
        followCursor: true,
        theme: 'dark',
        fixed: {
          enabled: false,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        },
      },
    };
  }, [keyTime, maxVs, minVs, theme.palette.primary.main, theme.palette.secondary.main]);
  const [width, setWidth] = useState('99%');

  useEffect(() => {
    setWidth('100%');
  }, []);

  return (
    <Card className="w-full rounded-20 shadow">
      <div className="relative p-20 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <Typography className="h3 sm:h2 font-medium">{props.valueOfChart}</Typography>
        </div>
      </div>

      <div className="relative h-200 sm:h-320 p-16 sm:pb-16">
        <ReactApexChart
          width={width}
          options={options}
          series={series}
          type={options.chart.type}
          height={options.chart.height}
        />
      </div>
    </Card>
  );
}

export default memo(TempVsHum);
