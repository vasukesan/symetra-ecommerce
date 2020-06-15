const constants = require('./constants');
var expect  = require('chai').expect;
var assert = require('assert');
const client = require('./client');
const axios = require('axios')
const equal = 'equal'
const status = 'status'
const hasProp = 'hasProp'
const getDiscCount = 'getprop'
const checkDiscountFalse = 'checkDiscount'
const checkDiscountTrue = "checkTrue"

const ax = axios.create({
  baseURL: 'http://'+constants.HOSTNAME+':'+constants.PORT,
  timeout:1000
});

const discFreq = {discountFrequency : 20}
const discCode = {discountCode : 'SAVENOW'}
const shopItems = {items : 'dummy items'}
const username = {username : 'dummy user'}
describe('Test all response status', () => {
  mochaTestPost("update frequency", 'admin/discount/frequency',discFreq,status)
  mochaTestPost("update discountCode", 'admin/discount/code',discCode,status)
  mochaTestPost("customer login", 'customer/login',username,status)
  mochaTestPost("customer purchase", 'customer/purchase',shopItems,status)
  mochaTestPost("customer discount", 'customer/purchase?discount=SAVENOW',shopItems,status)
  mochaTestGet("get report", 'admin/report',status,'totalPurchases')
});

describe('Test functionality', () => {
  mochaTestPost("update frequency", 'admin/discount/frequency',discFreq,equal,discFreq)
  mochaTestPost("update discountCode", 'admin/discount/code',discCode,equal,discCode)
  mochaTestPost("customer login", 'customer/login',username,hasProp,'discountCode')
  mochaTestPost("customer purchase", 'customer/purchase',shopItems,hasProp, 'purchased')
  mochaTestPost("customer discount", 'customer/purchase?discount=SAVENOW',shopItems,checkDiscountFalse, 'false')
  mochaTestGet("get report", 'admin/report',hasProp, 'totalPurchases')
  mochaTestGet("get report", 'admin/report',hasProp, 'totalDiscounts')
});

describe('Test automatic discount', () => {
  const series = async() => {
    mochaTestGet("get report", 'admin/report',getDiscCount, 0)
    mochaTestPost("customer before discount hit", 'customer/purchase?discount=SAVENOW',shopItems,checkDiscountFalse, 'false')
    mochaTestPost("update frequency", 'admin/discount/frequency',{discountFrequency : 5},equal,{discountFrequency : 5})
    mochaTestPost("customer after  discount hit ", 'customer/purchase?discount=SAVENOW',shopItems,checkDiscountTrue, 'true')
    mochaTestGet("get report", 'admin/report',getDiscCount, 1)
  };
  series(); //necessary because I am measuring before and after 

});



//use mocha's promise support, no "done" vars
function mochaTestPost(testName, path, data,compare,expecting,val){
  return new Promise(resolve => {
      resolve(it(testName, () => {
        return ax.post(path,data)
        .then(response => {
          switch(compare){
            case status: 
              expect(response.status).to.deep.equal(constants.SUCCESS);
              break;
            case equal:
              expect(response.data).to.deep.equal(expecting);
              break;
            case hasProp:
              expect(response.data).to.have.property(expecting);
              break;
            case checkDiscountFalse:
              expect(response.data.discounted).to.be.false
              break;
            case checkDiscountTrue:
                expect(response.data.discounted).to.be.true
                break;
            default:
          }
        })
      }));
  })
  
}
//use mocha's promise support
function mochaTestGet(testName, path, compare,expecting){
  it(testName, () => {
    return ax.get(path)
    .then(response => {
      switch(compare){
        case status:
          expect(response.status).to.deep.equal(constants.SUCCESS);
          break;
        case hasProp:
          expect(response.data).to.have.property(expecting);
          break;
        case getDiscCount:
            expect(response.data.totalDiscounts).to.deep.equal(expecting);
            break;
        default:
      }
    })
  });
}





