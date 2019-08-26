import React from 'react'
import {
  render
} from 'react-dom'

import App from './app'

class AppContainder extends React.Component {
  state= {
    name: 'parcer 打包案例'
  }
  componetDidMount () {
    setTimeout(() => this.setState({name: 'parcer 打包123'}),2000)
  }
  render () {
    return <App name={this.state.name} ></App>
  }
}

render(
<AppContainder />,
document.getElementById('#app')
  )