import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import Chart from 'chart.js'
import '../../styles/main.css'

export default function LineChart({data}) {
    const ctx = useRef()
    let dates = [], quotes = []
    data.forEach(e => {
        dates.push(moment(e.timestamp).format('DD/MM/YYYY').toString())
        quotes.push(e.close)
    })
    const [, setChart] = useState()
    const chart = () => {
        setChart(
            new Chart(ctx.current, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `${data.length}-day interval Daily Quotes`,
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
                                display: false,
                                autoSkip: true,
                                maxTicksLimit: 20
                            },
                        }]
                    }
                }
            })
        )
    }

    useEffect(() => {
        chart()
    }, [data])

    return (
        <canvas className="canvas-lineChart" ref={ctx}></canvas>
    )
}
