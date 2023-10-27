const orderModel = require('../Model/orderModel')
let companyModel = require('../Model/companyModel')
let addressModel = require('../Model/addressModel')
const { generateAndSaveInvoice } = require('./pdfGenerator')
let userModel = require('../Model/userModel')
let totalTax = 0;
let totalper = 0;
let totalTaxPer = 0;
let totalDis = 0 ;
let totalGrossAmount = 0
const product = (data) => {
    let arr = []
    for (let i = 0; i < data?.product?.length; i++) {
        // console?.log(data?.product[i]?.productId?.taxId)
        // console?.log(data?.product[i]?.productId?.taxId?.taxPercent)
        totalDis = totalDis + data?.product[i]?.discount
        totalTax = totalTax + data?.product[i]?.tax
        totalper = totalper + data?.product[i]?.productId?.taxId?.taxPercent
        totalTaxPer = totalper / data?.product?.length
        totalGrossAmount = totalGrossAmount + data?.product[i]?.actualPrice
        arr.push(
            `<tr>
  <td rowspan="2">
      <h5 style="font-weight: 500; flex-wrap: wrap; width: 50%; padding: 2%;">
          ${i + 1}
      </h5>

  </td>
  <td>
      <h4 style="font-weight: 600;flex-wrap: wrap;   display: flex">${data?.product[i]?.productId?.name} <br />
          </h4>

  </td>
  <td style="font-weight: 400;">${data?.product[i]?.quantity}</td>
  <td style="font-weight: 400;">${data?.product[i]?.actualPrice}</td>
  <td style="font-weight: 400;">${data?.product[i]?.discount}</td>
  <td style="font-weight: 400;">${data?.product[i]?.tax}</td>
  ${national ?
                `<td style="font-weight: 400";>${data?.product[i]?.productId?.taxId?.taxPercent}  %</td>` : `<td style="font-weight: 400";>${(data?.product[i]?.productId?.taxId.taxPercent) / 2}  %</td><td style="font-weight: 400;">${(data?.product[i]?.productId?.taxId.taxPercent) / 2}  %</td>`}

  <td style="font-weight: 400;">${(data?.product[i]?.actualPrice * data?.product[i]?.quantity) - data?.product[i]?.discount}</td>
</tr>
<tr>`
        );
    }
    return arr;
}

let national = 0

exports.invoice = async (data) => {
    let companyData = await companyModel.findOne()
    let code = "invoice" + new Date().getTime()

    if (data?.shippingChargesId?.name == "NATIONAL") {
        national = 1;
    }
    if (national) {
        console.log("national aara hai")
    }
    // console.log("dfd",data)
    let userData = await userModel.findById(data?.userId?._id)
    // console.log(userData)
    // console.log(userData)
    let addressData = await addressModel?.findOne({ userId: userData?._id })
    generateAndSaveInvoice({
        html: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="style.css" />
        <style>
            html {
                font-size: 62.5%;
            }
    
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
    
            .boderbottom {
                border-bottom: 1px solid black;
                margin-top: 10px;
    
            }
    
            .container {
                padding: 0 5rem;
                width: 100%;
                font-family: 'Poppins', sans-serif;
                font-family: 'Roboto', sans-serif;
            }
    
            hr {
                border: 1.5px solid black;
            }
    
            .invoice {
                text-align: center;
                margin-top: 2rem;
            }
    
            .invoice-head {
                display: flex;
                justify-content: space-between;
                line-height: 1.5rem;
                margin: 10px;
            }
    
            /* .bold {
                font-weight: 700;
                font-size: 20px;
            } */
    
            .invoice-right {
                border: 1px dotted black;
                border-radius: 3px;
                /* padding: 5px; */
                height: 2.3rem;
                /* margin-top: 5px; */
                width: 30%;
                display: flex;
                justify-content: left;
                align-items: center;
            }
    
            .box {
                display: flex;
                justify-content: space-between;
                margin: 10px 10px 0 10px;
            }
    
            /* .box1{
          width: 330px;
          height: 170px;
      } */
            /* .b1 {
                line-height: 2rem;
                font-size: 20px;
            } */
    
            .b2 {
                line-height: 22px;
                font-size: 17px;
                padding: 12px 0 0 34px;
            }
    
            .b4 {
                text-align: center;
                line-height: 1.5rem;
                padding-top: 2rem;
            }
    
            .total-items {
                margin-top: 10px;
            }
    
            .start {
                text-align: start;
            }
    
            .product {
                width: 300px;
            }
    
            .title {
                width: 320px;
            }
    
            .qty {
                width: 50px;
                text-align: center;
            }
    
            .amount {
                width: 125px;
                text-align: center;
            }
    
            .tab {
                text-align: center;
                line-height: 70px;
            }
    
            .total {
                text-align: end;
                padding-right: 10rem;
            }
    
            .grand-right {
                display: flex;
                justify-content: end;
            }
            .grand-total {
                width: 30%;
                line-height: 25px;
                margin-top: 2rem;
            }
    
            .grand {
                display: flex;
                justify-content: space-between;
                font-size: 2rem;
            }
    
            .p {
                text-align: end;
            }
    
            .p1 {
                text-align: center;
            }
    
            .img {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 10px 0;
            }
    
            /* img {
                height: 60px;
            } */
    
            .return-policy {
                padding-top: 25rem;
                display: flex;
                justify-content: end;
            }
    
            .return {
                width: 20%;
                text-align: center;
            }
    
            /* .policy {
                margin-top: 2rem;
                line-height: 25px;
            } */
    
            #policy {
                margin: 20px 0;
                line-height: 3rem;
            }
    
            #contact {
                display: flex;
            }
    
            .contact {
                padding: 0 10px;
            }
    
            .border {
                border: 1px dotted black;
                display: flex;
            }
    
            .page {
                display: flex;
                justify-content: end;
            }
    
            .page-count {
                padding: 0 2rem;
            }
    
            .line {
                margin-left: 1px;
            }
    
            td {
                font-size: 1.5rem;
                text-align: center;
                padding: 1%
            }
    
            th {
                font-size: 1.7rem;
                text-align: center;
                padding: 1%
            }
    
            /* @media screen and (max-width: 768px) {
          .container {
            padding: 0 2rem;
          } }
        
          /* Adjust other styles for smaller screens */
            /* For example, you can change font sizes, margins, or layout for smaller screens */
    
    
            /* Media query for screens with a maximum width of 480px (typically mobile phones) */
            /* @media screen and (max-width: 480px) {
          .container {
            padding: 0 1rem;
          }
      } */
    
    
    
            @media (max-width: 900px) {
                html {
                    font-size: 45%;
                }
    
                .Card {
                    width: 80%;
                }
    
    
                .container {
                    padding: 0%;
                }
    
                .logo {
    
                    width: 50%;
                }
    
                th {
                    font-size: 1.5rem;
                    text-align: start;
                    padding: 0 15px;
                }
    
                td {
                    font-size: 1.3rem;
                }
    
    
    
            }
    
            @media (max-width: 1050px) {
                html {
                    font-size: 47%;
                }
    
                th {
                    font-size: 1.8rem;
                    text-align: start;
                    padding: 1px
                    border-bottom: 2px solid black
                }
    
                td {
                    font-size: 1.5rem;
                }
    
                .img {
                    width: 99%;
                    height: 23vh;
                }
    
                .dashed {
                    border-left: 2px dashed gray;
                    height: 50%;
                    margin-top: 5%;
                }
            }
    
    
    
            @media (max-width: 480px) {
                html {
                    font-size: 33%;
                }
                .invoice-right{
                    width: 42%;
                }
    
                td {
                    font-size: 1.5rem;
                }
    
                .logo {
    
                    width: 50%;
                }
    
                .Card {
                    width: 100%;
                }
    
                .img {
                    width: 100%;
                    height: 20vh;
                }
    
                .dashed {
                    border-left: 2px dashed gray;
                    height: 47%;
                    margin-top: 9%;
                }
    
                .green {
                    width: 14px;
                    height: 14px;
                }
            }
    
            @media (max-width: 360px) {
                html {
                    font-size: 23%;
                }
    
                .table {
                    font-size: 40.5% !important;
                }
    
                .logo {
    
                    width: 50%;
                }
    
                .img {
                    width: 100%;
                    height: 20vh;
                }
            }
        </style>
    </head>
    
    <body>
        <main class="container">
            <h1 class="invoice">Tax Invoice</h1>
    
            <div class="invoice-head">
                <div class="invoice-left" style="display: flex; gap: 7px; flex-direction: column;">
                    <h2 style="font-weight: 700; font-size: 1.5rem;">Sold By: ${companyData?.site_name} ,</h2>
                    <h3 style="font-weight: 400; width: 70rem;">
    
                        <span style="font-weight: 700; font-size: 1.5rem; ">Ship-from Address:</span> ${companyData?.address}
    
                    </h3>
    
    
    
    
                    <h2>GSTIN - <span style="font-weight: 400;">29AAXCS0655F1ZU</span></h2>
                </div>
                <div class="invoice-right">
    
                    <h3 style="font-size: 1.5rem;">Invoice Number - <span style="font-weight: 400;">${data?.serialNumber}</span>
                    </h3>
                </div>
            </div>
    
            <hr />
            <div class="box" style="width: 100%;">
                <div class="box1  " style="display: flex; flex-direction: column; gap: 8px; width: 33.33%;">
                    <h2>Order ID - <span style="font-weight: 600;">${data?._id}</span></h2>
                    <h2>Order Date - <span style="font-weight: 400;">${data?.createdAt.getDate()}-${data.createdAt.getMonth() + 1}-${data.createdAt.getFullYear()}</span></h2>
                    <h2>Invoice Date- <span style="font-weight: 400;">${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}</span></h2>
                    <h2>PAN: - <span style="font-weight: 400;">aaxcs0655f</span></h2>
                    <h2>CIN: - <span style="font-weight: 400; ">U52399DL2016PTC299716</span></h2>
    
    
                </div>
                <div class="box1 " style="display: flex; flex-direction: column; gap: 8px; width: 33.33%;">
                    <h2>Bill To </h2>
                    <h2>${userData.fullName}</h2>
                    <h2 style="font-weight: 400;">${addressData?.houseNumber}, ${addressData?.landmark}, ${addressData?.area}. ${addressData?.cityName} ${addressData?.pincode} ${addressData?.stateName}
                    </h2>
                    <h2>Phone: - <span style="font-weight: 400;">${addressData?.mobile}</span></h2>
    
                </div>
                <div class="box1 " style="display: flex; flex-direction: column; gap: 8px; width: 33.33%;">
    
                    <h2>Ship To </h2>
                    <h2>${userData?.fullName} </h2>
                    <h2 style="font-weight: 400;">${addressData?.houseNumber},${addressData?.landmark}, ${addressData?.area}.${addressData?.cityName} ${addressData?.pincode} ${addressData?.stateName}
                    </h2>
                    <h2>Phone: - <span style="font-weight: 400;">${addressData?.mobile}</span></h2>
                </div>
                <div style="    align-items: center;
            display: flex;
            justify-content: center; width: 15.33%;">
                    <h2 style="font-weight: 400; font-size: 1rem;">*Keep this invoice and
                        manufacturer box for
                        warranty purposes</h2>
                </div>
            </div>
    
            <h6 style="font-weight: 400; font-size: 1.6rem; padding: 1px;">Total items:${data?.product.length}</h6>
            <hr />
    
    


            <div>
            <table
                style="width: 100%; border-collapse: collapse;  border-top: 2px solid black;  border-bottom: 2px solid black;">

                <tr style=" border-bottom: 2px solid black">
                <th style="text-align: center  ">S.No  </th>
                <th style="text-align: center ">Title</th>
                <th>Qty</th>
                <th> Gross <br />Amount ₹</th>
                <th>Discount ₹</th>
                <th>Taxable <br /> Value ₹</th>
                ${national ?
                `<th>IGST <br /> %</th>` : `<th>CGST <br /> %</th><th>SGST <br /> %</th>`}
                <th>Total <br /> ₹</th>
                </tr>


                ${product(data)}
                <tr>
                 

                  <td></td>
                    <td ><span style="font-weight: 600; text-align:right">Shipping Charge</span></td>
                            <td style="font-weight: 400;">1</td>
                            <td style="font-weight: 400;">${data?.shippingCharges}</td>
                            <td style="font-weight: 400;">--</td>
                            <td style="font-weight: 400;">--</td>
                            ${national ?
                `<td style="font-weight: 400;">-- </td>` : `<td style="font-weight: 400;">-- </td>
                                <td style="font-weight: 400;">--</td>`}
                           
                            <td style="font-weight: 400;">${data?.shippingCharges}</td>

                </tr>

         
                <tr>
                <td></td>
                
                            <td colspan="12" style="padding:0" >
                              <hr/>
                            </td>
                        </tr>
                        <tr>
                        <td class="total" colspan="2">Total</td>
                        <td style="font-weight: 400;">${data?.product?.length}</td>
                        <td style="font-weight: 400;">${totalGrossAmount + data?.shippingCharges}</td>
                        <td style="font-weight: 400;">${totalDis}</td>
                        <td style="font-weight: 400;">${totalTax}</td>
                        ${national ?
                `<td style="font-weight: 400";>${totalTaxPer}  %</td>` : `<td style="font-weight: 400";>${totalTaxPer / 2}  %</td><td style="font-weight: 400;">${totalTaxPer / 2}  %</td>`}
                        
                        
                        <td style="font-weight: 400;">${data?.payableAmount}</td>
                        </tr>
             
               
              
            </table>
        </div>




            <hr />
            <div class="grand-right">
                <div class="grand-total">
                    <div class="grand">
                        <p style="font-weight: 500;">Grand Total</p>
                        <p><span class="bold">₹ ${data?.payableAmount}</span></p>
                    </div>
                    <h2 style="font-weight: 500;">Shreyash Retail Private Limited</>
                        <div style="align-items: center;
                        display: flex;
    
                        justify-content: center;"><img src="image.png" alt="Signature" /></div>
                        <p class="p1">Authorized Signatory</p>
                </div>
            </div>
    
            <hr />
            <div class="return-policy">
                <div class="return">
                    <img src="image.png" alt="Signature" />
                    <p style="font-size: 2rem">Thank you!</p>
                    <p>for shopping with us</p>
                </div>
            </div>
            <div class="policy">
                <h2 style="font-size: 2rem;">
                    Returns Policy<span style="font-size: 1.5rem; font-weight: 400; font-style: italic;">
                        : At Flipkart we try to deliver perfectly each and every time. But
                        in the off-chance that you need to return the item, please do so
                        with the </span><span style="font-size: 2rem;">original Brand box/price</span>
                    <span style="font-size: 1.5rem; font-weight: 400; font-style: italic;">tag, original packing and
                        invoice</span><span style="font-size: 1.5rem; font-weight: 400; font-style: italic;">
                        without which it will be really difficult for us to act on your
                        request. Please help us in helping you. Terms and conditions
                        apply</span>
                </h2>
                <p>
    
                </p>
                <div id="policy">
    
                    <span style="font-size: 1.5rem; font-weight: 400; font-style: italic;">The goods sold as are intended
                        for end user consumption and not
                        for re-sale Regd. office: Shreyash Retail Private Limited , A-285, Main
                        Bhisham Pitamaha Marg, Defence Colony, New Delh, New Delh -
                        110024</span>
    
    
                </div>
                <div style=" display: flex; gap:4px;">
                    <p style="font-size: 1.5rem; font-weight: 500;">Contact Flipkart: 1800 208 9898
                        <hr />
                    </p>
                    <hr />
    
                    <p style="font-size: 1.5rem; font-weight: 500;"> www.flipkart.com/helpcentre</p>
                </div>
            </div>
            <span class="border"></span>
            <div class="page" style="display: flex; gap:10px">
                <span style="font-size: 1.5rem;">E. & O.E. </span>
                <hr />
                <span style="font-size: 1.5rem;">page 1 of 1
                </span>
            </div>
        </main>
    </body>
    
    </html>`,
        code: code,
        orderId:data._id
    })
    return code;
}
