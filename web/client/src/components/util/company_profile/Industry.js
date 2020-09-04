import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { COMPANY_PROFILE_INDUSTRY} from '../../../gql_queries/CompanyProfile__GQL'
import LockedItem from '../LockedItem'
import IndustrySkeleton from '../../skeletons/company_profile/IndustrySkeleton'
import { Fragment } from 'react'


export default function Industry({data, fid}) {
    const [lock, changeLock] = useState(true)
    const [needFetch, changeFetchNeeded] = useState(false)
    const logoUnlockTry = () => {
        changeLock(!lock)
        changeFetchNeeded(!needFetch)
    }

    const LI = <LockedItem unlockTry={logoUnlockTry} extraClasses={['item-covered-companyProfile-content-item-sector']} lockSize={"xl"}/>

    return (
        <Fragment>
            { lock ? 
                LI
            : needFetch ? 
                <IndustryGQL fid={fid} errorComponent={LI}></IndustryGQL>
            :
                <IndustryContent data={data}></IndustryContent>
            }
        </Fragment>
    )
}

const IndustryGQL = ({fid, errorComponent}) => {
    const { loading, error, data } = useQuery(COMPANY_PROFILE_INDUSTRY, {
        variables: { fid }
    })
    if (loading) return <IndustryContent loading={loading}/>
    if (error) {
        console.error(error) // or handle
        return errorComponent
    }
    if (data) return <IndustryContent data={data.company_profile.finnhubIndustry}/>
}

//handle error
const IndustryContent = ({loading, data}) => {
    return (
        <Fragment>
            { loading && <IndustrySkeleton/>}
            { data && 
                <div className="companyProfile-content-item">
                    <div className="companyProfile-content-item-sector">
                        <span>{data}</span> 
                    </div>
                </div>
            }
        </Fragment>
    )
}
