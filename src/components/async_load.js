import React, { Component } from 'react'
export default (loadComponent, placeholder = '正在加载中') => {
  return class AsyncComponent extends Component{
    unmoount = false
    constructor(){
      super()
      this.state = {
        Child: null
      }
    }
    componentWillMount() {
      this.unmoount = true
    }
    async componentDidMount() {
      const { default: Child } = await loadComponent()

      if(this.unmoount) return
      this.setState({
        Child
      })
    }
    render () {
      const { Child } = this.state
      return (
        Child
        ? <Child {...this.props}/>
        : placeholder
      )
    }
  }
} 