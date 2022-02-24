import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Switch, FormControlLabel, FormGroup } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { useForm, FormProvider } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import { resetProduct, newProduct, getProduct } from '../store/productSlice';
import SmtpSettingsHeader from './websiteSettingsHeader'
import BasicInfoTab from './tabs/BasicInfoTab';


/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a product name')
    .min(5, 'The product name must be at least 5 characters'),
});

function websiteSettings(props) {
  const dispatch = useDispatch();
//   const product = useSelector(({ eCommerceApp }) => eCommerceApp.product);

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noProduct, setNoProduct] = useState(false);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

//   useDeepCompareEffect(() => {
//     function updateProductState() {;
//       const productId = "new"
//       if (productId === 'new') {
//         dispatch(newProduct());
//       } 
//     }

//     updateProductState();
//   }, [dispatch, routeParams]);

  // useEffect(() => {
  //   if (!product) {
  //     return;
  //   }
  //   /**
  //    * Reset the form on product state changes
  //    */
  //   reset(product);
  // }, [product, reset]);

//   useEffect(() => {
//     return () => {
//       /**
//        * Reset Product on component unload
//        */
//       dispatch(resetProduct());
//       setNoProduct(false);
//     };
//   }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  /**
   * Show Message if the requested products is not exists
   */
  if (noProduct) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such product!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/e-commerce/products"
          color="inherit"
        >
          Go to Products Page
        </Button>
      </motion.div>
    );
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        classes={{
          toolbar: 'p-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        }}
        header={<SmtpSettingsHeader />}
        content={
          <div className="p-16 sm:p-24 max-w-2xl">

            {/* <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-20">
                Website Name
            </Typography> */}

            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <BasicInfoTab MainName="Website Name"  purpose="name" focus={true}/>
            </div>

            {/*             
            <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-20">
               Admin Name
            </Typography> */}

            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <BasicInfoTab MainName="Admin Name"  purpose="min" focus={false}/>
            </div>

            {/* <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-20">
               Admin Email
            </Typography> */}

            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <BasicInfoTab MainName="Admin Email"  purpose="min" focus={false}/>
            </div>

            {/* <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-20">
               Upload Logo
            </Typography> */}

            <Controller
              name="email"
              // control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  required
                  label="Upload Logo"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default websiteSettings;

