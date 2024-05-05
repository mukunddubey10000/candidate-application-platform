import { useEffect, useState } from "react";

export default function useFetchListings({ offset, filters = {} }) {

    const [listings, setListings] = useState([]);
    const [moreAvailable, setMoreAvailable] = useState(true);
    const [loading, setLoading] = useState(true);

    const url = "https://api.weekday.technology/adhoc/getSampleJdJSON?limit=2";
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let availableParameters = 0;
    Object.keys(filters)?.map((ele) => {
        if (filters[ele] != null)
            return ++availableParameters;
    })

    useEffect(() => {
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ limit: (!availableParameters ? 9 : 100), offset: offset }),
        };

        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {

                if (!availableParameters && offset != 0)
                    setListings((prevListings) => [...(prevListings ?? []), ...JSON.parse(result)?.jdList]);
                else if (!availableParameters && offset == 0)
                    setListings(() => [...JSON.parse(result)?.jdList]);
                else {
                    setListings((prevListings) => {
                        return JSON.parse(result)?.jdList?.filter((ele) => {
                            let parametersPassed = 0;
                            //jdLink, jdUid, jobDetailsFromCompany, jobRole, location, maxExp,
                            // maxJdSalary,minExp, minJdSalary, salaryCurrencyCode
                            for (let x in filters) {
                                if (filters[x] == null)
                                    continue;
                                if (x == 'role' && ele?.jobRole?.toLowerCase() == filters[x].toLowerCase())
                                    parametersPassed++;
                                if (x == 'minBasePay' && ele?.minJdSalary >= filters[x])
                                    parametersPassed++;
                                if (x == 'techStack' && ele?.techStack?.toLowerCase() == filters[x]?.toLowerCase())
                                    parametersPassed++;
                                if (x == 'location' && ele?.location?.toLowerCase() == filters[x]?.toLowerCase())
                                    parametersPassed++;
                                if (x == 'experience' && filters[x] <= ele?.maxExp && filters[x] >= ele?.minExp)
                                    parametersPassed++;
                                if (x == 'companyName' && ele?.companyName?.toLowerCase()?.includes(filters[x]?.toLowerCase()))
                                    parametersPassed++;
                            }

                            if (parametersPassed == availableParameters)
                                return ele;
                        })
                    })
                }

                if (result?.totalCount <= moreAvailable)
                    setMoreAvailable(false);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }, [offset, availableParameters]);

    return { listings, setListings, loading, moreAvailable }
}