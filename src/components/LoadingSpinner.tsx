import type React from "react"

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading movies...</p>
    </div>
  )
}

export default LoadingSpinner
