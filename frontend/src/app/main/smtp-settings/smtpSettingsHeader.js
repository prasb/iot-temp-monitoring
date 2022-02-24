import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { saveProduct, removeProduct } from '../store/productSlice';

const styledTypoGraph = {
  marginLeft: '1rem',
};

function SmtpSettingsHeader(props) {
  const { onSubmit } = props;
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const featuredImageId = watch('featuredImageId');
  const images = watch('images');
  const name = watch('name');
  const theme = useTheme();
  const history = useHistory();

  return (
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
                  mail
                </Icon>
                <Typography
                  className="text-16 sm:text-20 truncate font-semibold"
                  style={styledTypoGraph}
                >
                  SMTP Settings
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
          onClick={onSubmit}
          // startIcon={<Icon className="hidden sm:flex">delete</Icon>}
        >
          Save
        </Button>
      </motion.div>
    </div>
  );
}

export default SmtpSettingsHeader;
