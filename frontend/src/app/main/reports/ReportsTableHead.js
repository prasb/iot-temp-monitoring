import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const rows = [
  {
    id: 'UID',
    align: 'center',
    disablePadding: true,
    label: 'Device Location',
  },
  {
    id: 'TM',
    align: 'center',
    disablePadding: false,
    label: 'Time',
    sort: true,
  },
  {
    id: 'PV01',
    align: 'center',
    disablePadding: false,
    label: 'Temperature',
  },
  {
    id: 'PV02',
    align: 'center',
    disablePadding: false,
    label: 'Humidity',
  },
];

const useStyles = makeStyles(theme => ({
  actionsButtonWrapper: {
    background: theme.palette.background.paper,
  },
}));

function ProductsTableHead(props) {
  const classes = useStyles(props);
  const { selectedProductIds } = props;
  const numSelected = selectedProductIds.length;

  const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);

  const dispatch = useDispatch();

  const createSortHandler = property => event => {
    props.onRequestSort(event, property);
  };

  function openSelectedProductsMenu(event) {
    setSelectedProductsMenu(event.currentTarget);
  }

  function closeSelectedProductsMenu() {
    setSelectedProductsMenu(null);
  }

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map(row => {
          return (
            <TableCell
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              ) : (
                <>{row.label}</>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default ProductsTableHead;
