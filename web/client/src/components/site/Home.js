import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../images/logo.png'
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

export default function Home() {
    return (
        <div className="home">
            <div className="home-detail">
                <div>
                    <img src={logo}></img>
                </div>
                <div className="home-detail-phrase">
                    <span>Find out if your trading instincts are true.</span>
                </div>
                <div className="home-detail-buttons">
                    <Link to="/game">
                        <button className="home-detail-button home-detail-button-play">
                            <div>
                                <span>Play</span>
                                <PlayArrowIcon/>
                            </div>
                        </button>
                    </Link>
                    <Link to="/">
                        <button className="home-detail-button home-detail-button-rules">
                            <div>
                                <span>Rules</span>
                                <MenuBookIcon/>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
