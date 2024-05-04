import { useEffect, useState } from "react";

export default function useFetchListings({ offset }) {

    const [listings, setListings] = useState([]);
    const [moreAvailable, setMoreAvailable] = useState(true);
    const [loading, setLoading] = useState(true);

    const url = "https://api.weekday.technology/adhoc/getSampleJdJSON?limit=2";
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ limit: 6, offset: offset }),
    };

    useEffect(() => {
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                setListings((prevListings) => [...(prevListings ?? []), ...JSON.parse(result)?.jdList]);
                if (result?.totalCount <= moreAvailable)
                    setMoreAvailable(false);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }, [offset]);

    return { listings, loading, moreAvailable }
}