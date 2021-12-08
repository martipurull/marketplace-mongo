import PdfPrinter from 'pdfmake'

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
            // {
            //     image: `${ data.imageUrl }`,
            //     width: 150,
            //     height: 150,
            //     style: 'centerme'
            // },
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