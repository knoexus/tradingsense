import React from 'react'

const numberWithCommas = (x) => x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '???'  // change

export default function FinancialsReported({ data: { accessNumber, startDate, endDate, quarter, year, report: { bs, cf, ic } }}) {
    const v = (type) => (
        <div>
            { type !== [] ? type.map((e, idx) => 
                <div key={idx}>
                    <span>{e.label}: {numberWithCommas(e.value)} {e.unit.toUpperCase()}</span>
                </div>
            ) : null}
        </div>
    )
    return (
        <div className="financials">
            <h2>Financials</h2>
            {v(bs)}
            {v(cf)}
            {v(ic)}
        </div>
    )
}
