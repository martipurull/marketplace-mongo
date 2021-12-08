import PdfPrinter from 'pdfmake'
import path from 'path'

export const encodeImage = async (imgUrl) => {
    try {
        const base64Image = await imageToBase64(imgUrl)
        return base64Image
    } catch (error) {
        console.log(error)
    }
}

export const getPDFReadableStream = data => {

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
                image: `data:image/${ path.extname(data.imageUrl) };base64,${ data.encodedImage }`,
                width: 250,
                height: 250,
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
                alignment: 'center'
            },
            centerme: {
                alignment: 'center'
            }
        },
        defaultStyle: {
            font: "Helvetica",
        }
    }
    console.log(docDefinition.content.image)
    const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
    pdfReadableStream.end()

    return pdfReadableStream
}