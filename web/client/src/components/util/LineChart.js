import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import Chart from 'chart.js'

export default function LineChart({data, actual_gapToEndPoint, daysMargin}) {
    const ctx = useRef()
    let dates = [], quotes = []
    data.forEach(e => {
        dates.push(moment(e.timestamp).format('DD/MM/YYYY').toString())
        quotes.push(e.close)
    })
    const mockArray = Array.from(Array(actual_gapToEndPoint).map(e => null))
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
                        label: `${daysMargin}-day interval Daily Quotes (${data.length} trading days)`,
                        data: quotesWithSpace,
                        fill: false,
                        borderColor: [
                            'rgba(244,0,0,0.8)'
                        ]
                    }]
                },
                plugins: [{
                    afterDraw: function(chart) {
                        let x_coord = []
                        const ctx = chart.ctx
                        try {
                            const meta = chart.getDatasetMeta(0)
                            x_coord.push(meta.data[quotesWithSpace.length-1-actual_gapToEndPoint]._model.x)
                            x_coord.push(meta.data[quotesWithSpace.length-1]._model.x)
                        } catch { return }
                        x_coord.forEach(x => {
                            const topY = chart.scales['y-axis-0'].top
                            const bottomY = chart.scales['y-axis-0'].bottom
                            ctx.save()
                            ctx.setLineDash([10, 2]);
                            ctx.beginPath()
                            ctx.moveTo(x, topY)
                            ctx.lineTo(x, bottomY)
                            ctx.lineWidth = 3
                            ctx.strokeStyle = ''
                            ctx.stroke()
                            ctx.restore()
                        })
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
                                    else if (i == xLabels.length-1-actual_gapToEndPoint) {
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
