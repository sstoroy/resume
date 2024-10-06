const Image = require('@11ty/eleventy-img');

const THUMBNAIL_WIDTH = 400;
const RESIZED_FORMAT = "jpeg";

const IMAGEFOLDER = 
    process.env.NODE_ENV === 'production' 
        ? "/minimaskin/assets/img" 
        : "/assets/img";

function prepare(content) {
    const { minify } = require('html-minifier');
    return minify(content);
}

async function makeImages(src, size) {
    const options = {
        formats: [RESIZED_FORMAT],
        widths: [size || THUMBNAIL_WIDTH],
        urlPath: `${IMAGEFOLDER}/thumbs/`,
        outputDir: './dist/assets/img/thumbs/'
    };

    let images = await Image(src, options);

    let originalFilename = src.split('/').pop();
    return {
         original: {
            filename: originalFilename,
            url:`${IMAGEFOLDER}/${originalFilename}`
        },
        thumb: images[RESIZED_FORMAT][0]
    }
}

async function singleImage(imageSrc, alt, thumbSize) {
    let images = await makeImages(`./src/posts/img/${imageSrc}`, thumbSize);
    
    let output = `
        <div class="w-full sm:w-1/2 md:w-1/3 self-stretch p-2 mb-2">
            <div class="rounded shadow-md h-full">
                <a href="${images.original.url}" target="_blank">
                    <img class="rounded-t cursor-pointer" src="${images.thumb.url}" alt="${alt || images.original.filename}" width="${images.thumb.width}" height="${images.thumb.height}">
                </a>
                <div class="px-6 py-5">
                    <div class="font-semibold text-lg mb-2">
                        <a class="text-slate-900 hover:text-slate-700" href="${images.original.url}" target="_blank" style="text-decoration: none !important;">${alt || "Opne original"}</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    return prepare(output);
}

function gallery(content) {
    let output = `
        <div class="flex flex-wrap -mx-2">
            ${content}
        </div>
    `;
    return prepare(output);
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addShortcode('image', singleImage);

    eleventyConfig.addPairedShortcode('gallery', gallery);
}