import React, { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { openFullscreen } from '../../../extras/fullScreen'
import { useMutation } from '@apollo/client'
import { MUTATION_SET_IS_FULLSCREEN } from '../../../apollo-sm/mutations'

export default function Header() {
    const [isOpen, toggleOpen] = useState(false)
    const [changeISFS] = useMutation(MUTATION_SET_IS_FULLSCREEN)
    const pathName = window.location.pathname
    return (
        <Fragment>
            <div className={`nav-toggler ${isOpen ? "nav-toggler-open" : ""}`} onClick={() => toggleOpen(!isOpen)}>
                { [...Array(6).keys()].map(e => <span key={e}></span>) }
            </div>
            <div className={`sideNavPanel ${isOpen ? "sideNavPanel-open" : ""}`}>
                <Link to="/" className={pathName == "/" ? "sideNavPanel-link-active" : ""}>Home</Link>
                <Link to="/game" onClick={() => openFullscreen(changeISFS)} className={pathName == "/game" ? "sideNavPanel-link-active" : ""}>Game</Link>
                <Link to="/rules" className={pathName == "/rules" ? "sideNavPanel-link-active" : ""}>Rules</Link>
            </div>
        </Fragment>
    )
}
