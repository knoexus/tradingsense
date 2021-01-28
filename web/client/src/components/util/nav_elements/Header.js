import React, { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
    const [isOpen, toggleOpen] = useState(false)
    const pathName = window.location.pathname
    return (
        <Fragment>
            <div className={`nav-toggler ${isOpen ? "nav-toggler-open" : ""}`} onClick={() => toggleOpen(!isOpen)}>
                { [...Array(6).keys()].map(e => <span key={e}></span>) }
            </div>
            <div className={`sideNavPanel ${isOpen ? "sideNavPanel-open" : ""}`}>
                <Link to="/" className={pathName == "/" ? "sideNavPanel-link-active" : ""}>Home</Link>
                <Link to="/game" className={pathName == "/game" ? "sideNavPanel-link-active" : ""}>Game</Link>
                <Link to="/rules" className={pathName == "/rules" ? "sideNavPanel-link-active" : ""}>Rules</Link>
            </div>
        </Fragment>
    )
}
