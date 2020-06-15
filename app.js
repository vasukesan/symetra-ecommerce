var express = require('express')
const app = express()
const constants = require('./constants');

let storeData = {
  n : 100,
  discountCode : 'BUYBUYBUY', //default value
  discountBool : false,  //explicit on and off
  purchaseCount : 0,
  discountCount : 0,
  updateDiscountCount : 0 //purchase count from most recent discount award
}


app.use(express.json()) 


//admin updates frequency
app.post('/admin/discount/frequency', function (req, res) {
  n = req.body.discountFrequency
  if(storeData.purchaseCount-storeData.updateDiscountCount>=n){ 
    //discount awarded from new n
    storeData.discountBool = true
    storeData.updateDiscountCount = storeData.purchaseCount
  }
  res.json({discountFrequency: n})
    
});

//admin updates discount code
app.post('/admin/discount/code', function (req, res) {
  storeData.discountCode = req.body.discountCode
  return res.json({discountCode: storeData.discountCode }
  );
})

//customer logs in and gets discount code, if available
app.post('/customer/login', function (req, res) {
  let currentDiscount = storeData.discountCode;
  if(!storeData.discountBool){
    currentDiscount = "Not available";
  }
  return res.json({
      greeting: 'Hello Customer!',
      discountCode: currentDiscount
    }  
  );
})

//handles purchase with and without discount 
app.post('/customer/purchase', function (req, res) {
  //nth purchaser gets discount
  storeData.purchaseCount++; //if invalid discountCode, purchase anyway
  if(storeData.purchaseCount-storeData.updateDiscountCount>=storeData.n){
    storeData.discountBool = true; 
    storeData.updateDiscountCount = storeData.purchaseCount;
  }

  const customerCode = req.query.discount //handle unsafe query for prod
  let discounted = false;
  if(storeData.discountCode==customerCode && storeData.discountBool==true){
    storeData.discountCount++;
    discounted = true;
  }

  return res.json({
    purchased : req.body.items, //respond with the items purchased
    discounted: discounted
  });  
})


//admin gets report 
app.get('/admin/report', function (req, res) {
  res.json( {
    totalPurchases: storeData.purchaseCount,
    totalDiscounts: storeData.discountCount
  });
})

app.listen(constants.PORT, () => console.log('Basic e-commerce app listening at http://'+constants.HOSTNAME+':'+constants.PORT))