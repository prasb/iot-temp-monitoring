import _ from '@lodash';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';




function AnalyticsDashboardOptions(props) {

  return (
    <div>
        <div className="flex flex-col flex-shrink-0 sm:flex-row items-center justify-between py-24">
          <FormControl className="flex w-full sm:w-320 mx-16" variant="outlined">
            <InputLabel htmlFor="category-label-placeholder"> Select Device </InputLabel>
            <Select
              value={props.selectedCategory}
              onChange={props.handleSelectedCategory}
              input={
                <OutlinedInput
                  labelWidth={'category'.length * 9}
                  name="devices"
                  id="category-label-placeholder"
                />
              }
            >
              <MenuItem value="all">
                <em> All </em>
              </MenuItem>
              {props.categories.map((category) => (
                <MenuItem value={category.value} key={category.id}>
                  {category.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
    </div>
  );
}

export default AnalyticsDashboardOptions;
