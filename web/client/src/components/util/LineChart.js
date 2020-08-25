import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import Chart from 'chart.js'

export default function LineChart({data}) {
    const predictionGap = 30

    const ctx = useRef()
    let dates = [], quotes = []
    data.forEach(e => {
        dates.push(moment(e.timestamp).format('DD/MM/YYYY').toString())
        quotes.push(e.close)
    })
    const mockArray = Array.from(Array(predictionGap).map(e => null))
    const quotesWithSpace = quotes.concat(mockArray)
    const datesWithSpace = dates.concat(mockArray)
    const [myChart, setChart] = useState()

    const chart = () => {
        if (myChart) myChart.destroy()
        setChart(
            new Chart(ctx.current, {
                type: 'line',
                data: {
                    labels: datesWithSpace,
                    datasets: [{
                        label: `${data.length}-day interval Daily Quotes`,
                        data: quotesWithSpace,
                        fill: false,
                        borderColor: [
                            'rgba(244,0,0,0.8)'
                        ]
                    }]
                },
                plugins: [{
                    afterDraw: function(chart) {
                        const ctx = chart.ctx
                        const x = 520-3
                        const topY = chart.scales['y-axis-0'].top
                        const bottomY = chart.scales['y-axis-0'].bottom
                        ctx.save()
                        ctx.setLineDash([10, 2]);
                        ctx.beginPath()
                        ctx.moveTo(x, topY)
                        ctx.lineTo(x, bottomY)
                        ctx.lineWidth = 3
                        ctx.strokeStyle = '#FFDC5E'
                        ctx.stroke()
                        ctx.restore()
                    }
                }],
                options: {
                    spanGaps: true,
                    tooltips: {
                        callbacks: {
                           title: () => null,
                           label: (tooltipItem) => tooltipItem.yLabel
                        }
                     },
                    scales: {
                        xAxes: [{
                            offset: true,
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                display: true,
                                // autoSkip: true,
                                maxTicksLimit: Infinity
                            },
                            afterTickToLabelConversion: function(data){
                                let xLabels = data.ticks
                                xLabels.forEach((_, i) => {
                                    if (i == xLabels.length-1){
                                        xLabels[i] = 'Day X'
                                    }
                                    else if (i == xLabels.length-1-predictionGap) {
                                        xLabels[i] = 'Day 0'
                                    }
                                    else {
                                        xLabels[i] = ""
                                    }
                                })
                            } 
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
