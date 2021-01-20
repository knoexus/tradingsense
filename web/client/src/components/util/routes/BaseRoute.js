import React from 'react'
import { Route } from 'react-router-dom'
import Header from '../nav_elements/Header'
import Footer from '../nav_elements/Footer'

import '../../../styles/main.scss'

export default function BaseRoute({ component: Component , ...rest }) {
    return (
        <Route {...rest} component={(props)=>(
            <div className="main">
                <Header />
                <div className="main-centre">
                    <Component {...props} />
                </div>
                <Footer/>
            </div>
        )}
        />
    )
}
