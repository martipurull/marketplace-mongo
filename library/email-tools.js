import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendProductConfirmation = async (productData) => {
    const msg = {
        to: productData.email,
        from: process.env.SENDER_EMAIL,
        subject: `Confirmed: ${ productData.name } has been created and added to NFT Marketplace.`,
        text: `We're happy to confirm the creation and addition of your product ${ productData.name } to the NFT Marketplace.
               The product id is ${ productData.id }. We suggest you keep it safe for your records.
                We hope your NFT sells for 100 times its value today.`,
        html: `We're happy to confirm the creation and addition of your product ${ productData.name } to the NFT Marketplace. <br>
               The product id is <strong>${ productData.id }</strong>. We suggest you keep it safe for your records. <br>
                We hope your NFT sells for 100 times its value today.`
    }
    await sgMail.send(msg)
}