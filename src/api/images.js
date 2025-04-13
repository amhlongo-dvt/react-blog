export const createImage = async (token, image) => {
    console.log(image)

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/images?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(image),
    })

    return await res.json()
}

export const getImageById = async (imageId) => {
    console.log(`imageId is ${imageId}`)

    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/images/${imageId}`,
    )
    return await res.json()
}
