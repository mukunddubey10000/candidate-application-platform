import React, { useEffect, useState } from 'react'
import './Filter.css'

const Filter = ({ opened, onClick, states, setOffset, setListings = () => { }, ...props }) => {

    const [
        setExperience,
        setCompanyName,
        setLocation,
        setRemote,
        setTechStack,
        setMinBasePay,
        setRole
    ] = [...states];

    const debounce = function (fn, t = 300) {
        //This code template is from my leetcode profile
        let timerID;
        return function (...args) {
            if (timerID)
                clearTimeout(timerID);
            timerID = setTimeout(() => fn(...args), t);
        }
    };

    const resetFilter = () => {
        setListings([]);
        setOffset((prev) => {
            if (prev == 0)
                setOffset(-1);
            return 0;
        });
        setCompanyName(null);
        setExperience(null);
        setLocation(null);
        setRemote(null);
        setTechStack(null);
        setRole(null);
        setMinBasePay(null);
    }

    const setter = (func) => (event) => {
        if (!event?.target?.value?.length)
            resetFilter();
        func(event?.target?.value);
        setOffset((prev) => {
            if (prev == 0)
                setOffset(-1);
            return 0;
        });
        setListings([]);
    }

    return (
        <div className='filter-container'>
            <div className='drop-down'>
                <span>Drop Down</span>
                <input placeholder="Enter Company Name" onInput={debounce(setter(setCompanyName), 500)} value={props?.companyName} />
                <input placeholder="Enter Experience (in Years)" onInput={debounce(setter(setExperience), 500)} value={props?.experiencce} />
                <input placeholder="Enter desired location" onInput={debounce(setter(setLocation), 500)} value={props?.location} />
                <input placeholder="Enter min base pay" onInput={debounce(setter(setMinBasePay), 500)} value={props?.minBasePay} />
                <input placeholder="Enter desired role" onInput={debounce(setter(setRole), 500)} value={props?.role} />
                <input placeholder="Enter tech stack(comma seperated)" onInput={debounce(setter(setTechStack), 500)} value={props?.techStack} />

                <button className='filter-button' onClick={resetFilter}>Reset</button>
            </div>

        </div>
        //Add motion.div to display text in empty area 
        //saying "Add your filters here etc etc" -> instructions
    )
}

export default Filter