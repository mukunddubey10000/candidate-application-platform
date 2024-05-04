import React, { useEffect, useState, useCallback, useRef } from 'react'
import './Listings.css'
import useFetchListings from './listingUtils';

const Listings = () => {

    const [longText, setLongText] = useState(0);
    const [offset, setOffset] = useState(0);

    const { listings, loading, moreAvailable } = useFetchListings({ offset: offset });

    const observer = useRef();
    const lastListingItemRef = useCallback((element) => {
        //lastListingItemRef is called on last element's render
        if (loading) return;

        if (observer.current) observer.current.disconnect();
        //Above line is for re-attaching observer intersection in new list's top
        //element(since we're calling lastListingItemRef so we're attaching it on last ele)
        observer.current = new IntersectionObserver(enteries => {
            if (enteries[0].isIntersecting && moreAvailable) {
                //Only call API when more data is available
                setOffset(prev => prev + 1);
                //Now increase offset/pageNumber so our custom hook
                //named useFetchListings can be called
            }
        })
        if (element) observer.current.observe(element)
    }, [loading, moreAvailable]);

    return (
        <div className="listings-container-column">
            {listings?.map((item, index) => {
                //jdLink, jdUid, jobDetailsFromCompany, jobRole, location, maxExp,
                // maxJdSalary,minExp, minJdSalary, salaryCurrencyCode
                const itemLogo = "https://jobs.weekday.works/_next/static/media/logo-small.08826abd.png";
                let description = item?.jobDetailsFromCompany;
                if (!longText)
                    description = description?.slice(0, 300) + ".....";
                return (
                    <div className='listings-item' ref={index === listings?.length - 1 ? lastListingItemRef : null}>
                        <div className='item-header'>
                            <img src={itemLogo} alt="" className='itemLogo' />
                            <span>Company Name</span>
                        </div>

                        <div className="item-header-title">
                            <span>{item?.jobRole}</span>
                            <span>{item?.location}</span>
                        </div>

                        <div className='salary-range'>
                            <span>{`Estimated Salary: ${item?.salaryCurrencyCode == 'USD' ? '$' : ''} ${item?.minJdSalary ?? 0} - ${item?.maxJdSalary}`}</span>
                        </div>

                        <div className={longText ? 'description-longText' : 'description-shortText'}>
                            <span className='location-role'>{description}</span>
                            {/* Put any icons here */}
                        </div>

                        {!longText ? (<div className="ReadMore-Blur" />) : (<></>)}
                        <div
                            className={!longText ? 'Read-More-Text' : "Read-Less-Text"}
                            onClick={() => setLongText((prev) => 1 - prev)}
                        >
                            <span style={{ color: 'green', fontWeight: 600 }}>Read {!longText ? "More" : "Less"}</span>
                        </div>

                        <div className="apply-btn">
                            <span className='Experience'>{`Experience: ${item?.minExp ?? 0} - ${item?.maxExp ?? 0} years`}</span>
                            <button onClick={() => window.open(item?.jdLink)}>Apply</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Listings