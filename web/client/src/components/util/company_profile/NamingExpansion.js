import React, { useState, Fragment } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { COMPANY_PROFILE_NAME_TICKER_EXCHANGE } from '../../../gql_queries/CompanyProfile__GQL'
import { MUTATION_ADD_TO_CURRENT_POINTS } from '../../../apollo-sm/mutations'
import LockedItem from '../LockedItem'
import NamingExpansionSkeleton from '../../skeletons/company_profile/NamingExpansionSkeleton'


export default function NamingExpansion({data, fid}) {
    const [lock, changeLock] = useState(data.value === null)
    const [needFetch, changeFetchNeeded] = useState(false)
    const [addToCP] = useMutation(MUTATION_ADD_TO_CURRENT_POINTS)
    const logoUnlockTry = () => {
        changeLock(!lock)
        changeFetchNeeded(!needFetch)
        addToCP({
            variables: {
                addPoints: -data.price
            }
        })
    }

    const LI = <LockedItem handler="Name" price={data.price} unlockTry={logoUnlockTry} extraClasses={['item-covered-companyProfile-content-item-name']}/>

    return (
        <Fragment>
            { lock ? 
                LI
            : needFetch ? 
                <NamingExpansionGQL fid={fid} errorComponent={LI}></NamingExpansionGQL>
            :
                <NamingExpansionContent data={data.value}></NamingExpansionContent>
            }
        </Fragment>
    )
}

const NamingExpansionGQL = ({fid, errorComponent}) => {
    const { loading, error, data } = useQuery(COMPANY_PROFILE_NAME_TICKER_EXCHANGE, {
        variables: { fid }
    })
    if (loading) return <NamingExpansionContent loading={loading}/>
    if (error) {
        console.error(error) // or handle
        return errorComponent
    }
    if (data) return <NamingExpansionContent data={data.company_profile.nameTickerExchange.value}/>
}

//handle error
const NamingExpansionContent = ({loading, data}) => {
    return (
        <Fragment>
            { loading && <NamingExpansionSkeleton/> }
            { data &&
                <div className="companyProfile-content-item">
                    <div className="companyProfile-content-item-name">
                        <h3>{data.name}</h3> 
                        <span>{data.exchange} / {data.ticker}</span>         
                    </div>                 
                </div>
            }
        </Fragment>
    )
}