import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { COMPANY_PROFILE_LOGO } from '../../../gql_queries/CompanyProfile__GQL'
import { MUTATION_ADD_TO_CURRENT_POINTS } from '../../../apollo-sm/mutations'
import LockedItem from '../LockedItem'
import LogoSkeleton from '../../skeletons/company_profile/LogoSkeleton'
import { Fragment } from 'react'


export default function Logo({data, fid}) {
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

    const LI = <LockedItem handler="Logo" price={data.price} unlockTry={logoUnlockTry} extraClasses={["item-covered-companyProfile-logo"]}/>

    return (
        <Fragment>
            { lock ? 
                LI
            : needFetch ? 
                <LogoGQL fid={fid} errorComponent={LI}></LogoGQL>
            :
                <LogoContent data={data.value}></LogoContent>
            }
        </Fragment>
    )
}

const LogoGQL = ({fid, errorComponent}) => {
    const { loading, error, data } = useQuery(COMPANY_PROFILE_LOGO, {
        variables: { fid }
    })
    if (loading) return <LogoContent loading={loading}/>
    if (error) {
        console.error(error) // or handle
        return errorComponent
    }
    if (data) return <LogoContent data={data.company_profile.logo.value}/>
}

const LogoContent = ({loading, data}) => {
    const [imgLoaded, changeImgLoaded] = useState(false)
    return (
        <Fragment>
            { (loading || !imgLoaded) && <LogoSkeleton/> }
            { data && 
                <div style={imgLoaded ? {} : { display: 'none' }} className="companyProfile-logo">
                    <div className="companyProfile-content-item">
                        <img alt="Logo" src={data} onLoad={() => changeImgLoaded(true)}></img> 
                    </div>
                </div>
            }
        </Fragment>
    )
}
