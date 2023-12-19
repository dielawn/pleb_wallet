async function getData(url, apikey, content_type) {
    const headers = new Headers()
    if (apikey) {
        headers.append('X-Api-Key', apikey)
    }
    if (content_type) {
        headers.append('Content-type', content_type)
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        })
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`)
        }

        return await response.text()
    } catch (error) {
        throw new Error(`Eroor fetching data. Status: ${error.message}`)
    }
}

async function postJson(url, apikey, content_type, json) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': content_type,
                'X-Api-Key': apikey,
            },
            body: json,
        })
        if (!response.ok) {
            throw new Error(`Failed to post data. Status: ${response.status}`)
        }
        const jsonResponse = await response.json()
       
        return jsonResponse
    } catch (error) {
        console.error(`Error posting data: ${error.message}`)
        throw error
    }
}

export default {
    getData,
    postJson,
}
