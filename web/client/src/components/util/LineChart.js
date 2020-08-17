import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import Chart from 'chart.js'

export default function LineChart({data}) {
    const ctx = useRef()
    let dates = [], quotes = []
    data.forEach(e => {
        dates.push(moment(e.timestamp).format('DD/MM/YYYY').toString())
        quotes.push(e.close)
    })
    const [myChart, setChart] = useState({})
    const chart = () => {
        setChart(
            new Chart(ctx.current, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `${data.length}-day interval Quotes`,
                        data: quotes,
                        fill: false,
                        borderColor: [
                            'rgba(255,77,83,0.8)'
                        ]
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 20
                            }
                        }]
                    }
                }
            })
        )
    }

    useEffect(() => {
        chart()
    }, [])

    return (
        <canvas ref={ctx}></canvas>
    )
}
