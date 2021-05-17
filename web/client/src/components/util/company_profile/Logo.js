import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { COMPANY_PROFILE_LOGO } from '../../../gql_queries/CompanyProfile__GQL'
import { MUTATION_ADD_TO_CURRENT_POINTS } from '../../../apollo-sm/mutations'
import LockedItem from '../LockedItem'
import LogoSkeleton from '../../skeletons/company_profile/LogoSkeleton'
import { Fragment } from 'react'
import error_logo from '../../../images/error-logo.png'

export default function Logo({data, fid}) {
    const [lock, changeLock] = useState(data.value === null)
    const [needFetch, changeFetchNeeded] = useState(false)
    const logoUnlockTry = () => {
        changeLock(!lock)
        changeFetchNeeded(!needFetch)
    }

    const LI = <LockedItem handler="Logo" price={data.price} unlockTry={logoUnlockTry} extraClasses={["item-covered-companyProfile-logo"]}/>

    return (
        <Fragment>
            { lock ? 
                LI
            : needFetch ? 
                <LogoGQL fid={fid} price={data.price} errorComponent={LI}></LogoGQL>
            :
                <LogoContent is_gql={false} data={data.value} price={0}></LogoContent>
            }
        </Fragment>
    )
}

const LogoGQL = ({fid, price, errorComponent}) => {
    const { loading, error, data } = useQuery(COMPANY_PROFILE_LOGO, {
        variables: { fid }
    })
    if (loading) return <LogoContent is_gql={true} loading={loading} price={price}/>
    if (error) {
        console.error(error) // or handle
        return errorComponent
    }
    if (data) return <LogoContent is_gql={true} data={data.company_profile.logo.value} price={price}/>
}

const LogoContent = ({loading, is_gql, data, price}) => {
    const [imgLoaded, changeImgLoaded] = useState(false)
    const [imgError, changeImgError] = useState(false)
    const [addToCP] = useMutation(MUTATION_ADD_TO_CURRENT_POINTS)
    const setImgLoaded = () => {
        changeImgLoaded(true)
        if (is_gql) {
            addToCP({
                variables: {
                    addPoints: -price
                }
            })
        }
    }
    
    return (
        <Fragment>
            { ((loading || !imgLoaded) && !imgError) && <LogoSkeleton/> }
            { data && 
                <div style={imgLoaded || imgError ? {} : { display: 'none' }} className="companyProfile-logo">
                    <div className="companyProfile-content-item">
                        { !imgError ? 
                            <img alt="Logo" src={data} onError={() => changeImgError(true)} onLoad={() => setImgLoaded()}></img> 
                            :
                            <img alt="Logo" src={error_logo}></img> 
                        }
                    </div>
                </div>
            }
        </Fragment>
    )
}
