import React  from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { CloudPlatform } from '../types'
import Skeleton from '@material-ui/lab/Skeleton'

interface CloudPlatformListProps {
	cloudPlatforms: CloudPlatform[],
	loading?: boolean
}

function CloudPlatformList({ cloudPlatforms, loading }: CloudPlatformListProps) {

  if (loading) {
    return (
      <div data-testid="cloud-platform-list--placeholder">
        {Array.apply(null, Array(10)).map((_, index) => <Skeleton key={index}/>)}
      </div>
    )
  }
  
	return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>cloud platform</TableCell>
            <TableCell align="right">description</TableCell>
            <TableCell align="right">provider</TableCell>
            <TableCell align="right">region</TableCell>
            <TableCell align="right">Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cloudPlatforms.map((platform) => (
            <TableRow key={platform.name} data-testid="cloud-platform-list--item">
              <TableCell component="th" scope="row">
                {platform.name}
              </TableCell>
              <TableCell align="right">{platform.description}</TableCell>
              <TableCell align="right">{platform.providerDescription}</TableCell>
              <TableCell align="right">{platform.region}</TableCell>
              <TableCell align="right">
                ({platform.geolocation.latitude.toFixed(2)}, {platform.geolocation.longitude.toFixed(2)})
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
	)
}

export default CloudPlatformList