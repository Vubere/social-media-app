import React from "react"


type P = any
type SS = any
interface S { hasError: boolean, message: string}

class ErrorBoundary extends React.Component<P,S,SS>{
  constructor(props:any){
    super(props);
    this.state = {
      hasError: false,
      message: ''
    }
  }
  getDerivedStateFromError(){
    return {hasError: true}
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({...this.state, message: errorInfo.componentStack})
  }
  render(): React.ReactNode {

    if(this.state.hasError){
      return <p> Error encountered {this.state.message}</p>
    }
    return this.props.children
  }
}
export default ErrorBoundary