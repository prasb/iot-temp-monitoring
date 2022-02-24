import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { motion } from 'framer-motion';
import AnalyticsDashboardOptions from './AnalyticsDashboardOptions';

const styledTypoGraph = {
  marginLeft: '1rem',
};

function DashboardHeader(props) {
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
                  dashboard
                </Icon>
                <Typography className="text-16 sm:text-20 truncate font-semibold" style={styledTypoGraph}>
                  {'Dashboard'}
                </Typography>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* <motion.div
                className="flex"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
                <AnalyticsDashboardOptions categories={props.categories} selectedCategory={props.selectedCategory} handleSelectedCategory={props.handleSelectedCategory} />
            </motion.div> */}
    </div>
  );
}

export default DashboardHeader;

// import Typography from '@material-ui/core/Typography';
// import { withStyles } from "@material-ui/core/styles";
// import { motion } from 'framer-motion';
// import AnalyticsDashboardOptions from './AnalyticsDashboardOptions';

// const WhiteTextTypography = withStyles({
//     root: {
//       color: "#FFFFFF"
//     }
//   })(Typography);

// function DashboardHeader(){
//     return (
//         <div className="flex flex-row flex-shrink-0 items-center justify-between py-0.5 flex-1 w-full">
//             <WhiteTextTypography
//                 component={motion.div}
//                 variant="display4"
//                 className="px-16 pb-8 text-18 subpixel-antialiased font-extrabold"
//                 >
//                 Dashboard
//             </WhiteTextTypography>
//             <AnalyticsDashboardOptions/>
//         </div>
//     )
// }

// export default DashboardHeader;
