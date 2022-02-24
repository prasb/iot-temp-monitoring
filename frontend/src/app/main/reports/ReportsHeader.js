import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { useState, useContext } from 'react';
import axios from 'axios';
import fileSaver from 'file-saver';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { DeviceContext } from '../../fuse-layouts/layout1/Layout1';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment-timezone';

const styleDiv = {
  display: 'flex',
  flexDirection: 'row',
  alignContent: 'space-between',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexWrap: 'nowrap',
};

function ProductsHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);
  const mainTheme = useSelector(selectMainTheme);
  const context = useContext(DeviceContext);
  const [state, setState] = useState({
    fromDate: null,
    toDate: null,
  });
  const [downloadingType, setDownloadingType] = useState(false);

  const onDownload = async (fileType) => {
    try {
      setDownloadingType(fileType);
      const response = await axios({
        url: `/es/reports`,
        method: 'GET',
        responseType: 'blob',
        params: {
          fileType,
          start: moment(state.fromDate).tz('Asia/Kolkata').startOf('day').toISOString(),
          end: moment(state.toDate).tz('Asia/Kolkata').endOf('day').toISOString(),
          uid: context.state.uid,
        },
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      fileSaver.saveAs(
        blob,
        `${context.state.uid}-temperature-humidity-report-${moment(state.fromDate)
          .tz('Asia/Kolkata')
          .format('MM-DD-YYYY')}-to-${moment(state.toDate)
          .tz('Asia/Kolkata')
          .format('MM-DD-YYYY')}.${fileType}`
      );
      setDownloadingType('');
    } catch (err) {
      console.log(err);
      setDownloadingType('');
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-between flex-wrap">
      <div className="flex items-center">
        <Icon
          component={motion.span}
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { delay: 0.2 } }}
          className="text-24 md:text-32"
        >
          clear_all
        </Icon>
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Reports
        </Typography>
      </div>

      <div style={styleDiv}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          style={{
            marginRight: 16,
            color: 'black',
          }}
        >
          <DatePicker
            id="fromDate"
            autoComplete="off"
            placeholderText="From Date"
            type="date"
            showMonthYearDropdown
            selected={state.fromDate}
            className="p-8 rounded"
            onChange={(e) => setState({ ...state, fromDate: e })}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          style={{
            marginRight: 16,
            color: 'black',
          }}
        >
          <DatePicker
            id="toDate"
            autoComplete="off"
            placeholderText="To Date"
            type="date"
            showMonthYearDropdown
            selected={state.toDate}
            className="p-8 rounded"
            onChange={(e) => setState({ ...state, toDate: e })}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          className="flex"
        >
          <Button
            onClick={() => onDownload('csv')}
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            disabled={downloadingType === 'csv' || !state.fromDate || !state.toDate}
          >
            <span className="hidden sm:flex">
              {downloadingType === 'csv' ? 'Downloading CSV' : 'Download CSV'}
            </span>
          </Button>
          <Button
            onClick={() => onDownload('xlsx')}
            className="whitespace-nowrap ml-16"
            variant="contained"
            color="secondary"
            disabled={downloadingType === 'xlsx' || !state.fromDate || !state.toDate}
          >
            <span className="hidden sm:flex">
              {downloadingType === 'xlsx' ? 'Downloading Excel' : 'Download Excel'}
            </span>
          </Button>
          <Button
            onClick={() => onDownload('pdf')}
            className="whitespace-nowrap ml-16"
            variant="contained"
            color="secondary"
            disabled={downloadingType === 'pdf' || !state.fromDate || !state.toDate}
          >
            <span className="hidden sm:flex">
              {downloadingType === 'pdf' ? 'Downloading PDF' : 'Download PDF'}
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductsHeader;
