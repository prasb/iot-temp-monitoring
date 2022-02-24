import TextField from '@material-ui/core/TextField';
// import { Autocomplete } from '@material-ui/lab';
// import { Autocomplete } from '@material-ui/lab';
import { useFormContext, Controller } from 'react-hook-form';

function BasicInfoTab(props) {
  const { type } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  const maxName = type === 'humidity' ? 'maxHumidity' : 'maxTemp';
  const minName = type === 'humidity' ? 'minHumidity' : 'minTemp';
  return (
    <div>
      <Controller
        name={maxName}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors[maxName]}
            helperText={errors[maxName]?.message}
            label={type === 'humidity' ? 'Max Humidity' : 'Max Temperature'}
            autoFocus
            variant="outlined"
            fullWidth
            type="number"
          />
        )}
      />

      <Controller
        name={minName}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors[maxName]}
            helperText={errors[maxName]?.message}
            label={type === 'humidity' ? 'Min Humidity' : 'Min Temperature'}
            autoFocus
            variant="outlined"
            fullWidth
            type="number"
          />
        )}
      />
    </div>
  );
}

export default BasicInfoTab;
