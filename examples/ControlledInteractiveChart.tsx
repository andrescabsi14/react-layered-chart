/*
This example implements a chart with custom behavior. It doesn't let you pan
a week beyond the data, on either end.
*/

import * as React from 'react';
import {
  ChartProvider,
  ConnectedInteractionCaptureLayer,
  ConnectedLineLayer,
  DataLoader,
  Interval,
  Stack,
  enforceIntervalBounds,
  DEFAULT_SHOULD_PAN
} from '../src';
import { SIMPLE_LINE_DATA, SIMPLE_LINE_X_DOMAIN, SIMPLE_LINE_Y_DOMAIN } from './test-data';

const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;

// The bounds within which the view should always be contained.
const CHART_BOUNDS = {
  min: SIMPLE_LINE_X_DOMAIN.min - ONE_WEEK_MS,
  max: SIMPLE_LINE_X_DOMAIN.max + ONE_WEEK_MS
};

// All series need to have an ID.
const SERIES_ID = 'foo';

// Set up a test data loader that will just return this static data.
const SIMPLE_LINE_DATA_LOADER: DataLoader = () => ({
  [SERIES_ID]: new Promise(resolve => {
    resolve({
      data: SIMPLE_LINE_DATA,
      yDomain: SIMPLE_LINE_Y_DOMAIN
    });
  })
});

// For simplicity in this example, the controlled domain is kept on component
// state, but you should use whatever means is appropriate for your environment.
interface State {
  xDomain: Interval;
}

class ControlledInteractiveChart extends React.Component<{}, State> {
  // Declare some sane default.
  state: State = {
    xDomain: SIMPLE_LINE_X_DOMAIN
  };

  render() {
    return (
      // See BasicInteractiveChart.tsx for comments on things that are not commented here.
      <ChartProvider
        seriesIds={[ SERIES_ID ]}
        loadData={SIMPLE_LINE_DATA_LOADER}
        className='example-chart'
        // Control the prop!
        xDomain={this.state.xDomain}
        // Capture any requested changes, such as from ConnectedInteractionCaptureLayer.
        onXDomainChange={this._onXDomainChange.bind(this)}
        loadDataDebounceTimeout={0}
        pixelRatio={window.devicePixelRatio || 1}
      >
        <Stack>
          <ConnectedLineLayer seriesId={SERIES_ID}/>
          <ConnectedInteractionCaptureLayer shouldPan={DEFAULT_SHOULD_PAN}/>
        </Stack>
      </ChartProvider>
    );
  }

  private _onXDomainChange(xDomain: Interval) {
    // Use the provided utility to munge the X domain to something acceptable.
    this.setState({
      xDomain: enforceIntervalBounds(xDomain, CHART_BOUNDS)
    });
  };
}

const CHART = <ControlledInteractiveChart/>;

export default CHART;
