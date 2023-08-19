import React from 'react'
import {ReactComponent as GitHubLogo} from '../../../images/github-logo.svg'

export default function Footer() {
    return (
        <footer>
            <div>
                <span>
                    © 2020 – {new Date().getFullYear()} TradingSense | By <a href="https://github.com/knoexus">@knoexus <GitHubLogo/></a>
                </span>
            </div>
        </footer>
    )
}
