import React, { useCallback, useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CloudPlatforms from './CloudPlatforms'

function ErrorFallback(props: FallbackProps) {
  return (
    <>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        An error occurred while showing the Cloud platforms.
        <Button onClick={props.resetErrorBoundary}>Retry again</Button>
      </Typography>
    </>
  )
}

function App() {
  const [cloudPlatformKey, setCloudPlatformKey] = useState(0)
  const rerenderCloudPlatforms = useCallback(() => {
    setCloudPlatformKey(value => value + 1)
  }, [])

  return (
    <div className="App">
      <ErrorBoundary 
        resetKeys={[cloudPlatformKey]}
        onReset={rerenderCloudPlatforms}
        fallbackRender={ErrorFallback}
      >
        <CloudPlatforms key={cloudPlatformKey} />
      </ErrorBoundary>
    </div>
  )
}

export default App
