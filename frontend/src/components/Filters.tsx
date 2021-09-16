import React, { useCallback } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CloudProvider } from '../types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 350,
    }
  })
)

interface FiltersProps {
  cloudProvider: string | null
  maximumDistance: number
  cloudProviderOptions: CloudProvider[]
  onChangeCloudProvider?(newValue: string): void
  onChangeMaximumDistance?(newValue: number): void
}

function Filters({
  cloudProvider,
  cloudProviderOptions,
  maximumDistance,
  onChangeCloudProvider,
  onChangeMaximumDistance
}: FiltersProps) {
  const classes = useStyles()
  const handleMaximumDistanceChange = useCallback((_: React.ChangeEvent<{}>, value: number | number[]) => {
    onChangeMaximumDistance && onChangeMaximumDistance(value instanceof Array ? value[0] : value)
  }, [onChangeMaximumDistance])
  
  const handleCloudProviderChange = useCallback((event: React.ChangeEvent<{value: unknown}>) => {
    onChangeCloudProvider && onChangeCloudProvider(event.target.value as string)
  }, [onChangeCloudProvider])

	return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={event => event.preventDefault()}
    >
      <FormControl className={classes.formControl}>
        <InputLabel id="cloud-provider-select-label">Cloud Provider</InputLabel>
        <Select
          labelId="cloud-provider-select-label"
          label="Cloud Provider"
          value={cloudProvider}
          onChange={handleCloudProviderChange}
          inputProps={{ 'data-testid': 'filters--cloud-provider-filter-input'}}
        >
          <MenuItem key="clear-option" value=""><em>None</em></MenuItem>
          {cloudProviderOptions.map(
            provider => (
              <MenuItem
                key={provider.name}
                value={provider.name}
              >
                {provider.description}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Typography id="cloud-platform-max-distance" gutterBottom>
          Max distance
        </Typography>
        <Slider
          defaultValue={0}
          min={0}
          max={100}
          value={maximumDistance}
          onChange={handleMaximumDistanceChange}
          aria-labelledby="cloud-platform-max-distance"
          valueLabelDisplay="auto"
          data-testid="filters--max-distance-input"
        />
      </FormControl>
    </form>
	)
}

export default Filters