import { useEffect, useState, useContext } from 'react';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import moment from 'moment';
import axios from 'axios';
import 'moment-timezone';
import FuseLoading from '@fuse/core/FuseLoading';
import { DeviceContext } from 'app/fuse-layouts/layout1/Layout1';
import reducer from './store';
import Widget5 from './widgets/Widget5';
// import { analyticsDashboardAppDB } from '../../../@fake-db/db/analytics-dashboard-db';
// import { analyticsDashboardAppDB1 } from '../../../@fake-db/db/analytics-dashboard-db-1';
import TempVsHum from './widgets/widgetTempVsHum';

function AnalyticsDashboardApp(props) {
  const context = useContext(DeviceContext);

  useEffect(() => {
    fetchData(context.state.uid);
  }, [context.state]);

  const [state, setState] = useState({
    loading: true,
    data: {},
    temperature: {},
    humidity: {},
    axes: [],
    tempData: [],
    humidityData: [],
    keyTime: [],
    error: false,
    minHum: 0,
    maxHum: 100,
    minTemp: 0,
    maxTemp: 100,
    minVs: 0,
    maxVs: 100,
  });

  const fetchData = async (uid) => {
    try {
      const response = await axios({
        url: '/es/aggs',
        method: 'POST',
        data: {
          uid,
          start: moment().tz('Asia/Kolkata').startOf('day').toISOString(),
          end: moment().tz('Asia/Kolkata').toISOString(),
        },
      });

      const temperature = [];
      const humidity = [];
      const axes = [];
      response.data.value.avgByDevices.UID.buckets[0]?.fiveMinAvg.buckets.forEach((item) => {
        temperature.push(parseFloat(Number(item.Temperature.value).toFixed(2)));
        humidity.push(parseFloat(Number(item.Humidity.value).toFixed(2)));
        axes.push(moment(item.key_as_string).tz('Asia/Kolkata').format('HH:mm a'));
      });

      const xData = response.data.value.avgTempVsHumidity.TempVsHumidity.buckets;
      const tempData = [];
      const humidityData = [];
      const keyTime = [];
      if (Array.isArray(xData)) {
        xData.forEach((value) => {
          humidityData.push(parseFloat(Number(value.Humidity.value).toFixed(2)));
          tempData.push(parseFloat(Number(value.Temperature.value).toFixed(2)));
          keyTime.push(moment(value.key_as_string).tz('Asia/Kolkata').format('HH:mm a'));
        });
      }
      setState({
        loading: false,
        data: response.data.value,
        temperature,
        humidity,
        axes,
        minTemp: Math.floor(Math.min(...temperature) - 5),
        maxTemp: Math.ceil(Math.max(...temperature) + 5),
        minHum: Math.floor(Math.min(...humidity) - 5),
        maxHum: Math.ceil(Math.max(...humidity) + 5),
        tempData,
        humidityData,
        keyTime,
        minVs: Math.floor(Math.min(...tempData, ...humidityData) - 5),
        maxVs: Math.ceil(Math.max(...tempData, ...humidityData) + 5),
      });
    } catch (err) {
      console.log(err);
      setState({
        ...state,
        error: true,
        loading: false,
      });
    }
  };

  const container = {
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  if (state.loading) {
    return <FuseLoading />;
  }
  if (state.error) {
    return <>Error</>;
  }

  return (
    <div className="w-full">
      <motion.div
        className="flex flex-col md:flex-row sm:p-8 container"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-1 flex-col min-w-0 pt-16">
          <div className="flex flex-col sm:flex sm:flex-row pb-32">
            <motion.div variants={item} className="widget flex w-full sm:w-1/2 p-16">
              <Widget5
                current={`${state.data.current.PV01}°C`}
                data={{
                  id: 'widget5',
                  series: {
                    today: [
                      {
                        name: 'Device',
                        data: state.temperature,
                      },
                    ],
                  },
                  options: {
                    chart: {
                      type: 'line',
                      width: '100%',
                      height: '100%',
                      stacked: true,
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
                      categories: state.axes,
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
                      min: state.minTemp,
                      max: state.maxTemp,
                      tickAmount: (state.maxTemp - state.minTemp) / 2,
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
                  },
                }}
                valueOfChart="Temperature"
              />
            </motion.div>

            <motion.div variants={item} className="widget flex w-full sm:w-1/2 p-16">
              <Widget5
                current={`${state.data.current.PV02}%`}
                data={{
                  id: 'widget5',
                  series: {
                    today: [
                      {
                        name: 'Device',
                        data: state.humidity,
                      },
                    ],
                  },
                  options: {
                    chart: {
                      type: 'line',
                      width: '100%',
                      height: '100%',
                      stacked: true,
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
                      categories: state.axes,
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
                      min: state.minHum,
                      max: state.maxHum,
                      tickAmount: (state.maxHum - state.minHum) / 2,
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
                  },
                }}
                valueOfChart="Humidity"
              />
            </motion.div>
          </div>
          <motion.div variants={item} className="widget w-full widget w-full p-16  pb-48">
            <TempVsHum
              keyTime={state.keyTime}
              minVs={state.minVs}
              maxVs={state.maxVs}
              series={[
                {
                  name: 'Temperature',
                  data: state.tempData,
                },
                {
                  name: 'Humidity',
                  data: state.humidityData,
                },
              ]}
              valueOfChart="Temperature vs Humidity"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default withReducer('analyticsDashboardApp', reducer)(AnalyticsDashboardApp);
