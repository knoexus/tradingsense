import React from 'react'
import chart from '../../images/rules-chart.png'
import card from '../../videos/rules-card.mov'
import technicals from '../../videos/rules-technicals-was.mov'
import company_info from '../../images/rules-company-info.png'
import modal from '../../videos/rules-modal.mov'
import Arrow from '../util/Arrow'
import useIntersect from '../../hooks/useIntersect'

export default function Rules() {
    const IDiv = props => {
        const buildThresholdArray = () => [...Array(50).keys()].map(x => x * 2 / 100) 
        const [ref, entry] = useIntersect({
            threshold: buildThresholdArray(),
            root: document.querySelector('.main'),
        })

        const iRatio = entry => {
            if (entry.isIntersecting) {
                //console.log([entry.target.className, entry.rootBounds.height, entry.target.offsetHeight, entry.intersectionRatio], (entry.target.offsetHeight*entry.intersectionRatio)/entry.rootBounds.height)
                if (entry.target.offsetHeight > entry.rootBounds.height) {
                    return (entry.target.offsetHeight*entry.intersectionRatio)/entry.rootBounds.height   
                }
            }
            return entry.intersectionRatio
        }

        return (
            <div style={{opacity: iRatio(entry) }} {...props} ref={ref} ratio={entry.intersectionRatio}>
                { props.children }
            </div>
        )
    }

    return (
        <div className="rules">
            <h1>Rules</h1>
            <hr/>
            <div>
                <IDiv className="rules-card">
                    <p><b>TradingSense</b> is a game which simulates mid-term trading in a fun way. The game introduces cards which represent assets and their trading information. As a good portion of this info is intentionally concealed, the cards can be manipulated with to get the maximum from the available data and help decide whether to buy or sell the asset.</p>
                    <video class="rules-media-display" muted Autoplay="autoplay" loop src={card} type="video/mp4"></video>
                </IDiv>
                <IDiv className="rules-chart">
                    <h2>Chart</h2>
                    <div>
                        <p>The chart shows past daily quotes for an arbitrary number of days with a gap where the line is hidden between Day 0 and Day X. Day 0 indicates your current position with respect to time. Day X stands for the day your prediction will be compared against. As an example, X = 20 means that you should make a decision on whether to buy or sell the asset relative to 20 days after day 0.</p>
                        <img class="rules-media-display" src={chart}></img>
                    </div>
                </IDiv>
                <IDiv className="rules-balance">
                    <h2>Balance and purchases</h2>
                    <p>The balance only accounts for how successful you trades are. However, a 3000$ improvised starting capital is given to unlock hidden stock info and prevent your balance from going negative too soon. With that said, if you still manage to go below 0, the game will be over.</p>
                    <div>
                        <img class="rules-media-display" src={company_info}></img>
                        <video class="rules-media-display" muted Autoplay="autoplay" loop src={technicals} type="video/mp4"></video>
                    </div>
                    <p>To help you make up your mind, info regarding the asset industry, or reveal its logo / name as well as technical indicators can be unlocked. With the latter you can select a day which you would like to unlock indicators for, but beware that its proximity to day X affects the price of an unlock. </p>
                </IDiv>
                <IDiv className="rules-buying-selling">
                    <h2>Buying and Selling</h2>
                    <div className="rules-buying-selling-arrows-example">
                        <p>Press right arrow if you wish to acquire the asset, or left if you wish to sell it.</p>
                        <div>
                            <Arrow side={"left"}/>
                            <Arrow side={"right"}/>
                        </div>
                    </div>
                    <div className="rules-buying-selling-modal-example">
                        <video class="rules-media-display" muted Autoplay="autoplay" loop src={technicals} type="video/mp4" src={modal}></video>
                        <p>You will be prompted to select how much of the asset you would like to sell (given that you virtually own it) or buy. This stands for the risk you are willing to take: the more you buy or sell - the bigger is the potential profit / loss. Please mind that you do not need to worry about the asset price - buying and selling is totally virtual and what matters is whether you got the market action right and to what extent. </p>
                    </div>
                    <p className="rules-important">Actions of buying and selling might be confusing but in fact are not too difficult to understand. For the both the price on day 0 will be compared against price on day X, also accounting the number of assets you have selected. If you decide to <b className="rules-buy">BUY</b> an asset, the profit / loss of selling it on day X will be added / subtracted from your balance. If you decide to <b className="rules-sell">SELL</b> an asset, the profit / loss of not holding it until day X will be added / subtracted from your balance. </p>
                </IDiv>
            </div>
        </div>
    )
}
