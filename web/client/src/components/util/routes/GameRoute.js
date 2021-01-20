import React from 'react'
import { Route } from 'react-router-dom'

export default function GameRoute({ component: Component , ...rest }) {
    return (
        <Route {...rest}  component={(props) => (
            <div>
                <Component {...props} />
            </div>
        )}
        />
    )
}
