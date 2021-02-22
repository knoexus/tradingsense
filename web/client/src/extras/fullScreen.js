const openFullscreen = (mutation) => {
    const elem = document.documentElement
    const params = {
      variables: {
        newIsFullScreen: true
      }
  }
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
      mutation(params)
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
      mutation(params)
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
      mutation(params)
    }
}

const closeFullscreen = (mutation) => {
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement) {
            const params = {
                variables: {
                  newIsFullScreen: false
                }
            }
            if (document.exitFullscreen) {
                document.exitFullscreen()
                mutation(params)
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
                mutation(params)
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen()
                mutation(params)
            }
    }
}

export { openFullscreen, closeFullscreen }