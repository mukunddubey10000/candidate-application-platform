import React, { useEffect, useState, useCallback, useRef } from 'react'
import './Listings.css'
import useFetchListings from './listingUtils';
import Filter from '../Filters/Filter';

const Listings = ({ }) => {

    const [longText, setLongText] = useState(0);
    const [offset, setOffset] = useState(0);
    const [filterOpened, setFilterOpened] = useState(false);

    //Below states for filter menu
    const [experience, setExperience] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const [location, setLocation] = useState(null);
    const [remote, setRemote] = useState(null);
    const [techStack, setTechStack] = useState(null);
    const [minBasePay, setMinBasePay] = useState(null);
    const [role, setRole] = useState(null);

    const stateSetter = [
        setExperience,
        setCompanyName,
        setLocation,
        setRemote,
        setTechStack,
        setMinBasePay,
        setRole
    ];
    const states = [
        experience,
        companyName,
        location,
        remote,
        techStack,
        minBasePay,
        role
    ]

    let filters = {
        experience: experience,
        companyName: companyName,
        location: location,
        // remote: remote,
        techStack: techStack,
        minBasePay: minBasePay,
        role: role
    };

    useEffect(() => {
        setOffset(0);
        setListings([]);
        filters = {
            experience: experience,
            companyName: companyName,
            location: location,
            // remote: remote,
            techStack: techStack,
            minBasePay: minBasePay,
            role: role
        };
    }, [experience, companyName, location, techStack, minBasePay, role])

    const { listings, setListings, loading, moreAvailable } = useFetchListings({ offset, filters });
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

    const toggleFilterMenu = () => {
        setFilterOpened(prev => !prev ? true : false);
    }

    return (
        <>
            <div className='filter-menu'>
                <img src="https://cdn-icons-png.flaticon.com/512/107/107799.png" alt="" className='filter-img' onClick={toggleFilterMenu} />
            </div>
            {
                filterOpened ?
                    <Filter
                        opened={filterOpened}
                        onClick={toggleFilterMenu}
                        states={stateSetter}
                        setOffset={setOffset}
                        listings={setListings}
                        props={{ ...states }}
                    /> : <></>
            }
            <div className="listings-container-column">

                {listings?.map((item, index) => {
                    //jdLink, jdUid, jobDetailsFromCompany, jobRole, location, maxExp,
                    // maxJdSalary,minExp, minJdSalary, salaryCurrencyCode
                    let description = item?.jobDetailsFromCompany;
                    if (!longText)
                        description = description?.slice(0, 300) + ".....";
                    return (
                        <div className='listings-item' ref={index === listings?.length - 1 ? lastListingItemRef : null}>
                            <div className='item-header'>
                                <img src={item?.logoUrl} alt="" className='itemLogo' />
                                <span>{item?.companyName}</span>
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
        </>
    )
}

export default Listings