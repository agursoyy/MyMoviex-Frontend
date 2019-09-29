import React from 'react'
class ErrorBoundary extends React.Component {

    constructor(props) {
      super(props);
      this.state = { mounted: false,error: null, errorInfo: null };
    }
    componentDidMount() {
      this.setState({mounted: true})
    }
    componentDidCatch(error, errorInfo) {
      // Catch errors in any components below and re-render with error message
      if(this.state.mounted) {
        this.setState({
          error: error,
          errorInfo: errorInfo
        })
      }

      // You can also log error messages to an error reporting service here
    }
    
    render() {
      if (this.state.errorInfo) {
        // Error path
        return (
          <div>
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          </div>
        );
      }
      // Normally, just render children
     else 
      return this.props.children;  
    }  
  }
  
export default ErrorBoundary;