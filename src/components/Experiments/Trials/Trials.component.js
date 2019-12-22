import React from 'react'

import DotsChart1D from '../../Charts/DotsChart1D/DotsChart1D.component'
import DotsChart2D from '../../Charts/DotsChart2D/DotsChart2D.component'
import DotsChart3D from '../../Charts/DotsChart3D/DotsChart3D.component'
import {ChartPropsType} from '../../Charts/ChartProps.type'

type Props = ChartPropsType & {numOfMertics: number}

export class Trials extends React.Component<Props> {
  render() {
    if (this.props.numOfMertics === 1) {
      return <DotsChart1D {...this.props} />
    }
    if (this.props.numOfMertics === 2) {
      return <DotsChart2D {...this.props} />
    }
    if (this.props.numOfMertics >= 3) {
      return <DotsChart3D {...this.props} />
    }
  }
}

export default Trials
