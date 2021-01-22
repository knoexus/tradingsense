import React, { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
    const [isOpen, toggleOpen] = useState(false)
    return (
        <Fragment>
            <div className={`nav-toggler ${isOpen ? "nav-toggler-open" : ""}`} onClick={() => toggleOpen(!isOpen)}>
                { [...Array(6).keys()].map(e => <span key={e}></span>) }
            </div>
            <div className={`sideNavPanel ${isOpen ? "sideNavPanel-open" : ""}`}>
                <Link to="/">Home</Link>
                <Link to="/game">Game</Link>
                <Link to="/rules">Rules</Link>
            </div>
        </Fragment>
    )
}
