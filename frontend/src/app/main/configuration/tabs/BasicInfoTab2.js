import TextField from '@material-ui/core/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function BasicInfoTab(props) {
  const { type = 'text', required = true } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Controller
        name={props.purpose}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type={type}
            className="mt-8 mb-16"
            error={!!errors.name}
            required={required}
            helperText={errors?.name?.message}
            label={props.MainName}
            autoFocus={props.focus}
            variant="outlined"
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default BasicInfoTab;
