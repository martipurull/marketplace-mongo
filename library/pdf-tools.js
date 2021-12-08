import PdfPrinter from 'pdfmake'
// import base64 from 'base-64'
// import path from 'path'
import imageToBase64 from 'image-to-base64'

export const encodeImage = async (imgUrl) => {
    try {
        const base64Image = await imageToBase64(imgUrl)
        return base64Image
    } catch (error) {
        console.log(error)
    }
}

export const getPDFReadableStream = data => {

    const encodeImage = async () => {
        try {
            const base64Image = await imageToBase64(data.imageUrl)
            return base64Image
        } catch (error) {
            console.log(error)
        }

    }

    const fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        },
    }

    const printer = new PdfPrinter(fonts)

    const docDefinition = {
        content: [
            {
                text: `${ data.name }`,
                style: 'header'
            },
            {
                text: `by ${ data.artist }`,
                style: 'subheader'
            },
            {
                image: `${ data.encodedImage }`,
                width: 150,
                height: 150,
                style: 'centerme'
            },
            {
                text: `${ data.description }`,
                style: 'description'
            }
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                marginBottom: 8,
                alignment: 'center'
            },
            subheader: {
                fontSize: 15,
                bold: true,
                marginBottom: 8,
                alignment: 'center'
            },
            description: {
                marginTop: 8,
            },
            centerme: {
                alignment: 'center'
            }
        },
        defaultStyle: {
            font: "Helvetica",
        }
    }

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
    pdfReadableStream.end()

    return pdfReadableStream
}