import React, { Component } from 'react'

export default class CardsCounter extends Component {
    state = {
        realMax: null
    }

    componentDidMount() {
        const { max } = this.props
        this.setState({
            realMax: max
        })
    }

    render() {
        const { current } = this.props
        const { realMax } = this.state
        return (
            <div className="cardsCounter">
                <h2>{realMax-current}/{realMax}</h2>
            </div>
        )
    }
}