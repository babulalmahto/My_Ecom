import cloudinary from "../config/cloudinary.js"

// upload images on cloudinary
export let uploadImageOnCloudinary = async (img) => {
    let images = []
    for (let i = 0; i < img.length; i++) {
        let result = await cloudinary.uploader.upload(img[i].path)
        images.push({ url: result.url, public_id: result.public_id })
    }
    return images
}

// delete images on the cloudinary
export let deleteImageOnCloudinary = async (img) => {
    for (let i = 0; i < img.length; i++) {
        await cloudinary.uploader.destroy(img[i].public_id, function (error, result) {
            if (error) {
                console.error("Something wrong while deleting the images", error)
            }
            else {
                return true
            }
        })
    }

}