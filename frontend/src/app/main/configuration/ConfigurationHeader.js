import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { useState } from 'react';

const styledTypoGraph = {
  marginLeft: '1rem',
};

function ProductHeader(props) {
  const { onSubmit, saving } = props;
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const featuredImageId = watch('featuredImageId');
  const images = watch('images');
  const name = watch('name');
  const theme = useTheme();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const handleOnSubmit = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-1 w-full items-center justify-between">
        <div className="flex flex-col items-start max-w-full min-w-0">
          <div className="flex items-center max-w-full">
            <div className="flex flex-row min-w-0 mx-8 sm:mc-16">
              <motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
                <div className="flex items-center justify-between">
                  <Icon
                    component={motion.span}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.2 } }}
                    className="text-24 md:text-32"
                  >
                    build
                  </Icon>
                  <Typography
                    className="text-16 sm:text-20 truncate font-semibold"
                    style={styledTypoGraph}
                  >
                    Configuration
                  </Typography>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
        >
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            onClick={handleOnSubmit}
          >
            {saving ? 'Saving' : 'Save'}
          </Button>
        </motion.div>
      </div>
      <Dialog
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="confirmation-dialog-title">Are you sure you want to save?</DialogTitle>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              onSubmit();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProductHeader;
