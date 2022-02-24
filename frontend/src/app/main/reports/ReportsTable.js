import { useState, useEffect, useContext } from 'react';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import axios from 'axios';
import moment from 'moment';
import { DeviceContext } from '../../fuse-layouts/layout1/Layout1';
import 'moment-timezone';
import ProductsTableHead from './ReportsTableHead';

function ProductsTable(props) {
  const dispatch = useDispatch();
  const products = [];
  const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);
  const context = useContext(DeviceContext);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: 'TM',
  });

  useEffect(() => {
    fetchData();
  }, [page, order, context.state.uid]);

  const fetchData = async () => {
    setLoading(true);
    const response = await axios({
      url: '/es',
      method: 'GET',
      params: {
        page,
        size: rowsPerPage,
        order: [order],
        uid: context.state.uid,
      },
    });
    setCount(response.data.pageInfo.totalCount);
    setData(response.data.value);
    setLoading(false);
  };

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map(n => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(item) {
    // props.history.push(`/apps/e-commerce/products/${item.id}/${item.handle}`);
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          Empty reports data
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ProductsTableHead
            selectedProductIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {data.map(n => {
              return (
                <TableRow
                  className="h-72 cursor-pointer"
                  hover
                  tabIndex={-1}
                  key={n.id}
                  onClick={event => handleClick(n)}
                >
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {n.LOC}
                  </TableCell>

                  <TableCell className="p-4 md:p-16 truncate" component="th" scope="row" align="center">
                    {moment(n.TM).tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm a')}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {n.PV01}
                    <span>°C</span>
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {n.PV02}
                    <span>%</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        rowsPerPageOptions={[]}
        className="flex-shrink-0 border-t-1"
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(ProductsTable);
