const puppeteer = require("puppeteer");
const nodemailer =require("nodemailer")
const { Credentials } = require("aws-sdk");
const S3 = require("aws-sdk/clients/s3");
// const path = require('path')
// const fs = require('fs')
const orderModel = require("../Model/orderModel")

exports.generateAndSaveInvoice = async ({ html, code ,orderId }) => {
  try {
    // Launch Puppeteer with the new headless mode
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ["--disable-extensions"],
      headless: "new", // Use the new headless mode
    });

    const page = await browser.newPage();
    await page.setContent(html);

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });
    console.log(pdfBuffer)
    // Close Puppeteer
    // await browser.close();

    // Initialize AWS S3
    const s3Client = new S3({
      region: process.env.LINODE_OBJECT_STORAGE_REGION || "ap-south-1",
      endpoint:
        process.env.LINODE_OBJECT_STORAGE_ENDPOINT ||
        "ap-south-1.linodeobjects.com",
      sslEnabled: true,
      s3ForcePathStyle: false,
      credentials: new Credentials({
        accessKeyId:
          process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY_ID || "NXBFVTX007YYQB6RN2TU",
        secretAccessKey: "5afy6ISNQqhwYTq6cWuCg8sGMtnOSqoifBh4gAgf",
      }),
    });

    // Upload PDF to S3 bucket
    const params = {
      Bucket: "satyakabirbucket",
      Key: `${code}.pdf`,
      Body: pdfBuffer,
      ACL: "public-read",
    };
    // console.log(params)
     let a = await s3Client.upload(params).promise();
    
    console.log(a)
   await orderModel.findByIdAndUpdate(
      {_id:orderId},
      {
        $set:{
        invoice:a.Location
      },
    },
    {new:true}
    )
    

    // setTimeout(()=>{
    //         s3Client.deleteObject({ Bucket: params.Bucket, Key: params.Key }).promise(); // Delete the PDF from S3
          
    //        console.log(`PDF deleted from S3: ${params.Key}`);
    //       },10000)
  }
  catch (error) {
            console.log("error",error.message)
           }

//     let orderData = await orderModel.findById(orderId).populate('userId')
//     let email = "bhupendramewada031@gmail.com"
//  let htmls = `<!DOCTYPE html>
//  <html lang="en">
//  <head>
//      <meta charset="UTF-8">
//      <meta name="viewport" content="width=device-width, initial-scale=1.0">
//      <title>Document</title>
//  </head>
//  <body>
//      <p>This Is Invoice Of Your Order <br/>
//         Thank You For Shopping !!!</p>
//  </body>
//  </html>`
// console.log("codii",code)


//     sendMailOTP(email,htmls,code)


//     setTimeout(()=>{
//       s3Client.deleteObject({ Bucket: params.Bucket, Key: params.Key }).promise(); // Delete the PDF from S3
    
//      console.log(`PDF deleted from S3: ${params.Key}`);
//     },10000)

//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// };

// async function sendMailOTP(email,htmls,code){

//   let transporter = nodemailer.createTransport({
//     host: "smtpout.secureserver.net", 
//     secure: true,
//     secureConnection: false, 
//     tls: {
//       ciphers:'SSLv3'
//     },
//     requireTLS:true,
//     port: 465,
//     debug: true,
//     auth: { 
//       user: "support@loader.co.in",
//       pass: "gyanesh@1g"
//     }
//       });
//        try {
//         let info = transporter.sendMail({
//           from: '"support@loader.co.in" <support@loader.co.in>', // sender address
//           to:email, // list of receivers
//           subject: "E-mail Verification", // Subject line
//           text: "Loader  ?",
//           attachments : [{
//             filename : "invoice.pdf", 
//             path : `https://satyakabirbucket.ap-south-1.linodeobjects.com/${code}.pdf`
//           }], 
//           html: htmls
//        });     
//        console.log("yy",info.response)
//        } catch (error) {
//         console.log("error",error.message)
//        }
  
}