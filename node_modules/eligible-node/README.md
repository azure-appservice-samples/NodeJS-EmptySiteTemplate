# eligible-node

[![Circle CI](https://circleci.com/gh/eligible/eligible-node.svg?style=svg&circle-token=e2b9b0bf71b7e2a14f2e77b85e1cc75de9f9a24e)](https://circleci.com/gh/eligible/eligible-node)
[![npm version](https://badge.fury.io/js/eligible-node.svg)](https://www.npmjs.com/package/eligible-node)

Node.js bindings for Eligible APIs (https://eligible.com). Eligible is built for developers needing HIPAA compliant connectivity to health insurance companies.

You can request an account at https://eligible.com/request-access

  * [Documentation](#documentation)
  * [Requirements](#requirements)
  * [Installation](#installation)
  * [Usage](#usage)
    * [Create instance](#create-instance)
    * [Test Mode](#test-mode)
    * [Example](#example)
    * [Coverage](#coverage)
      * [Retrieve Coverage](#retrieve-coverage)
      * [Retrieve Medicare](#retrieve-medicare)
      * [Retrieve Cost Estimates](#retrieve-cost-estimates)
    * [Payment](#payment)
      * [Payment Status](#payment-status)
    * [Claim](#claim)
      * [Create a Claim](#create-a-claim)
      * [Retrieve Single Claim Acknowledgements](#retrieve-single-claim-acknowledgements)
      * [Retrieve Multiple Claims Acknowledgements](#retrieve-multiple-claims-acknowledgements)
      * [Retrieve Single Claim Payment Report](#retrieve-single-claim-payment-report)
      * [Retrieve Specific Claim Payment Report](#retrieve-specific-claim-payment-report)
      * [Retrieve Multiple Claim Payment Report](#retrieve-multiple-claim-payment-report)
      * [Realtime Adjudication & Estimate](#realtime-adjudication--estimate)
    * [Payer](#payer)
      * [List All Payers](#list-all-payers)
      * [View a Payer](#view-a-payer)
      * [Search Options](#search-options)
      * [Search Options of a Payer](#search-options-of-a-payer)
    * [Customer](#customer)
      * [Create a Customer](#create-a-customer)
      * [Update a Customer](#update-a-customer)
      * [View a Customer](#view-a-customer)
      * [List Customers](#list-customers)
    * [Enrollment](#enrollment)
      * [Create an Enrollment](#create-an-enrollment)
      * [Update an Enrollment](#update-an-enrollment)
      * [Retrieve an Enrollment](#retrieve-an-enrollment)
      * [List Enrollments](#list-enrollments)
      * [Received PDF](#received-pdf)
        * [View Received PDF](#view-received-pdf)
        * [Download Received PDF](#download-received-pdf)
      * [Original Signature PDF](#original-signature-pdf)
        * [Create Original Signature PDF](#create-original-signature-pdf)
        * [Update Original Signature PDF](#update-original-signature-pdf)
        * [View Original Signature PDF](#view-original-signature-pdf)
        * [Delete Signature PDF](#delete-signature-pdf)
        * [Download Signature PDF](#download-signature-pdf)
    * [Referral](#referral)
      * [Referral Inquiry](#referral-inquiry)
      * [Create A Referral](#create-a-referral)
    * [Precertification](#precertification)
      * [Precertification Inquiry](#precertification-inquiry)
      * [Create A Precertification](#create-a-precertification)
    * [x12](#x12)
      * [Simple Post](#simple-post)
      * [MIME Post](#mime-post)
    * [Tickets](#tickets)
      * [Create a Ticket](#create-a-ticket)
      * [View a Ticket](#view-a-ticket)
      * [Update a Ticket](#update-a-ticket)
      * [List Tickets](#list-tickets)
      * [Create a Ticket Comment](#create-a-ticket-comment)
      * [List Comments for a Ticket](#list-comments-for-a-ticket)
  * [Errors](#errors)
  * [Testing](#testing)
  * [Developing](#developing)
  * [Support Forums](#support-forums)


## Documentation

Refer to https://eligible.com/rest for full documentation on Eligible APIs, their request parameters
and expected response formats.



## Requirements

Node.js 0.12 and above


## Installation


```sh
npm install eligible-node --save
```

## Usage


### Create instance

First create an `Eligible` object by passing your api key. You can pass the api key directly or as an object. You may also load your api key from environment variables.

```js

var Eligible = require('eligible-node');

// Get values from environment variables if nothing is passed in arguments
// available env variables: ELIGIBLE_API_KEY, ELIGIBLE_IS_TEST
var eligible = Eligible();

//or, pass them as object:
var eligible = Eligible({
    apiKey: 'foobar',
    isTest: true
});

//or, pass Config object
var config = new Eligible.Config;
config.setApiKey('foobar')
config.setTest(true);
var eligible = Eligible(config);

```

### Test Mode

To make the Eligible as explorable as possible, accounts have test-mode as well as live-mode. See above example to enable test mode on any of your requests and hit the sandbox.

### Example

Complete example on how to use the library:

```js

var Eligible = require('eligible-node');
var eligible = Eligible({
    apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
    isTest: true
});

// Retrieve a payer and it's search options

eligible.Payer.retrieve('62308')
  .then(function(payer){
    console.log(payer.payer_id);
    return payer.searchOptions(); //retrieve search options
  })
  .then(function(searchOptions){
    console.log(searchOptions)
  })
  .catch(Eligible.APIConnectionError, function(e){
    console.log('Connection Error');
  })
  .catch(Eligible.AuthenticationError, function(e){
      console.log('Authentication Error', e.message, e.code, e.response);
  })
  .catch(Eligible.InvalidRequestError, function(e){
      console.log('InvalidRequestError', e.message, e.code, e.response);
  })
  .catch(function(e){
    console.log(e);
  });
```
See [Errors](#errors) for a list of Error types.

### Coverage

#### [Retrieve Coverage](https://account.eligible.com/rest#retrieve-coverage)

```js
eligible.Coverage.all({
  payer_id: '00001',
  provider_last_name: 'Doe',
  provider_first_name: 'John',
  provider_npi: '0123456789',
  member_id: 'ZZZ445554301',
  member_first_name: 'IDA',
  member_last_name: 'FRANKLIN',
  member_dob: '1701-12-12',
  service_type: '30',
})
.then(function(coverage) {
  console.log(coverage)
})
.catch(function(e) {
  //
});
```

#### [Retrieve Medicare](https://account.eligible.com/rest#retrieve-medicare)

```js
eligible.Coverage.medicare({
  provider_npi: '0123456789',
  member_id: 'ZZZ445554301',
})
.then(function(medicare) {
  console.log(medicare);
})
.catch(function(e) {
  //
});
```

#### [Retrieve Cost Estimates](https://account.eligible.com/rest#cost-estimates)

```js
eligible.Coverage.costEstimates({
  provider_npi: '0123456789',
  provider_price: '1500.50',
  service_type: '1',
  network: 'IN',
})
.then(function(costEstimates) {
  console.log(costEstimates);
})
.catch(function(e) {
  //
});
```

### Payment

#### [Payment Status](https://account.eligible.com/rest#payment-status)

```js
eligible.Payment.status({
  payer_id: '00001',
  provider_last_name: 'Doe',
  provider_first_name: 'John',
  provider_npi: '0123456789',
  member_id: 'ZZZ445554301',
  member_first_name: 'IDA',
  member_last_name: 'FRANKLIN',
  member_dob: '1701-12-12',
  payer_control_number: 123123123,
  charge_amount: 125.00,
  start_date: '2010-06-15',
  end_date: '2010-06-15',
  trace_number: 'BHUYTOK98IK',
})
.then(function(payment) {
  console.log(payment)
})
.catch(function(e) {

});
```

### Claim

#### [Create a Claim](https://account.eligible.com/rest#claim_and_reports_create_a_claim)

```js
eligible.Claim.create(params)  // example params can be found in the REST document of this endpoint
  .then(function(claim) { // returns a claim instance
    console.log(claim);
    return claim.acknowledgements(); // get acknowledgements for this claim
  })
  .then(function(acknowledgements){
    console.log(acknowledgements);
  })
  .catch(function(e){
    //
  });
```

#### [Retrieve Single Claim Acknowledgements](https://account.eligible.com/rest#claim_and_reports_claim_acknowledgements_retrieve_single)

```js
eligible.Claim.getAcknowledgements('12121212')
  .then(function(data) {
    console.log(data);
  })
```

or, using `claim` instance either created manually or returned by `Claim.create()` method

```js
var claim = new eligible.Claim({'reference_id': '12121212'});
claim.acknowledgements()
  .then(function(data) {
    console.log(data);
  })
```

#### [Retrieve Multiple Claims Acknowledgements](https://account.eligible.com/rest#claim_and_reports_claim_acknowledgements_retrieve_multiple)

```js
eligible.Claim.queryAcknowledgements(query)
  .then(function(data) {
  })
```

#### [Retrieve Single Claim Payment Report](https://account.eligible.com/rest#claim_and_reports_claim_payment_reports_retrieve_single)

```js
eligible.Claim.getPaymentReport('BDA85HY09IJ')
	.then(function(payment) {
	})
```

or, using `claim` instance either created manually or returned by `Claim.create()` method

```js
var claim = new eligible.Claim({'reference_id': 'BDA85HY09IJ'});
claim.paymentReports()
  .then(function(payment_report) {
    console.log(payment_report);
  })
```

#### [Retrieve Specific Claim Payment Report](https://account.eligible.com/rest#claim_and_reports_claim_payment_reports_retrieve_specific)

```js
eligible.Claim.getPaymentReport('BDA85HY09IJ', 'ABX45DGER44')
	.then(function(payment) {
	})
```
or, using `claim` instance either created manually or returned by `Claim.create()` method

```js
var claim = new eligible.Claim({'reference_id': 'BDA85HY09IJ'});
claim.paymentReports('ABX45DGER44')
  .then(function(payment_report) {
    console.log(payment_report);
  })
```

#### [Retrieve Multiple Claim Payment Report](https://account.eligible.com/rest#claim_and_reports_claim_payment_reports_retrieve_multiple)

```js
eligible.Claim.queryPaymentReports(query)
	.then(function(data) {
	})
```

#### [Realtime Adjudication & Estimate](https://account.eligible.com/rest#claim_and_reports_realtime_claim)

```js
eligible.Claim.realtime(params) // example params can be found in the REST document of this endpoint
  .then(function(data) {
  })
  .catch(function(e){
  });
```

### Payer

#### [List All Payers](https://account.eligible.com/rest#list_payers)

```js
eligible.Payer.all({
    endpoint: 'coverage',
  })
  .then(function(payers) {
    console.log(payers);
  })
```

#### [View a Payer](https://account.eligible.com/rest#view_payer)

```js
eligible.Payer.retrieve('62308')
	.then(function(payer) {
	  return payer.searchOptions()
	})
	//retrieve search options for this payer
	.then(function(searchOptions){
	   console.log(searchOptions)
	})
	.catch()
```

#### [Search Options](https://account.eligible.com/rest#payer_search_options)

```js
eligible.Payer.searchOptions()
	.then(function(searchOptions) {
	  console.log(searchOptions)
	})
```

#### [Search Options of a Payer](https://account.eligible.com/rest#search_options_of_a_payer)

```js
eligible.Payer.searchOptions('62308')
	.then(function(searchOptions) {
	})
```
or, using `payer` instance either:

```js
var payer = new eligible.Payer({payer_id: '62308'});
payer.searchOptions()
  .then(function(searchOptions) {
    console.log(searchOptions);
  })
```

### Customer

#### [Create a Customer](https://account.eligible.com/rest#create_customers)

```js
eligible.Customer.create({
    customer: {
      name: 'ABC company',
    },
  })
  .then(function(customer) {
    console.log(customer.id);
  })
  .catch();
```

#### [Update a Customer](https://account.eligible.com/rest#update_customers)

```js
eligible.Customer.update('TN344YY67HH09KK', {
    customer: {
      name: 'XYZ company',
    },
  })
  .then(function(customer) {
    console.log(customer.id);
  })
  .catch(done);
```

#### [View a Customer](https://account.eligible.com/rest#show_customers)

```js
eligible.Customer.get('TN344YY67HH09KK')
  .then(function(customer) {
    console.log(customer.id);
  })
  .catch();
```

#### [List Customers](https://account.eligible.com/rest#list_customers)

```js
eligible.Customer.all({
    page: 1,
  })
  .then(function(data) {
    console.log(data.customers);
  })
  .catch();
```

### Enrollment

#### [Create an Enrollment](https://account.eligible.com/rest#create-enrollment)

```js
eligible.Enrollment.create(params) // example params can be found in the REST document of this endpoint
  .then(function(enrollment) {
    console.log(enrollment);
  })
  .catch();
```

#### [Update an Enrollment](https://account.eligible.com/rest#update-enrollment)

```js
eligible.Enrollment.update(params) // example params can be found in the REST document of this endpoint
  .then(function(enrollment) {
    console.log(enrollment);
  })
  .catch();
```

#### [Retrieve an Enrollment](https://account.eligible.com/rest#retrieve-enrollment)

```js
eligible.Enrollment.get(123)
  .then(function(enrollment) {
    console.log(enrollment);
  })
  .catch();
```

#### [List Enrollments](https://account.eligible.com/rest#list-enrollment)

```js
eligible.Enrollment.all({
    page: 1,
  })
  .then(function(data) {
    console.log(data.enrollment_npis);
  })
  .catch();
```

#### [View Received PDF](https://account.eligible.com/rest#view-received-pdf)

```js
eligible.Enrollment.viewReceivedPDF('123')
  .then(function(receivedPDF) {
    console.log(receivedPDF.download_url);
  })
  .catch();
```

#### [Download Received PDF](https://account.eligible.com/rest#download-received-pdf)

Returns a readable stream when successful

```js
eligible.Enrollment.downloadReceivedPDF('123')
  .then(function(pdf) {
    pdf.pipe(fs.createWriteStream('./received_pdf.pdf'))
  })
  .catch();
```

#### [Create Original Signature PDF](https://account.eligible.com/rest#create-original-signature-pdf)

You can either pass a path to PDF or a readable stream of the pdf file:

```js
eligible.Enrollment.createOriginalSignaturePDF('123', {
  file: './upload.pdf',
})
.then(function(originalSignaturePDF) {
  console.log(originalSignaturePDF.download_url);
})
.catch();
```

#### [Update Original Signature PDF](https://account.eligible.com/rest#update-original-signature-pdf)

You can either pass a path to PDF or a readable stream of the pdf file:

```js
eligible.Enrollment.updateOriginalSignaturePDF('123', {
  file: './upload.pdf',
})
.then(function(originalSignaturePDF) {
  console.log(originalSignaturePDF.download_url);
})
.catch();
```

#### [View Original Signature PDF](https://account.eligible.com/rest#view-original-signature-pdf)

```js
eligible.Enrollment.viewOriginalSignaturePDF('123')
  .then(function(originalSignaturePDF) {
    console.log(originalSignaturePDF.download_url);
  })
  .catch();
```

#### [Delete Signature PDF](https://account.eligible.com/rest#delete-original-signature-pdf)

```js
eligible.Enrollment.deleteOriginalSignaturePDF('123')
  .then(function(response) {
    console.log(response.message);
  })
  .catch(done);
```

#### [Download Signature PDF](https://account.eligible.com/rest#download-original-signature-pdf)

Returns a readable stream when successful

```js
eligible.Enrollment.downloadOriginalSignaturePDF('123')
  then(function(pdf) {
    pdf.pipe(fs.createWriteStream('./original_signature_pdf.pdf'))
  })
  .catch();
```
### Referral

#### [Referral Inquiry](https://account.eligible.com/rest#referral_inquiry)

```js
eligible.Referral.inquiry({
  payer_id: '60054',
  payer_name: 'Aetna',
  provider_type: 'attending',
  provider_last_name: 'Doe',
  provider_first_name: 'John',
  provider_npi: '0123456789',
  provider_phone_number: '1234567890',
  provider_taxonomy_code: '291U00000X',
  member_id: 'ZZZ445554301',
  member_first_name: 'IDA',
  member_last_name: 'FRANKLIN',
  member_dob: '1701-12-12',
  from_date: '2014-01-01',
  to_date: '2015-01-01',
})
.then(function(referral) {
})
.catch(done);
```

#### [Create A Referral](https://account.eligible.com/rest#referral_creation)

```js
eligible.Referral.create(params) // example params can be found in the REST document of this endpoint
  .then(function(referral) {
  })
  .catch(done);
```


### Precertification

#### [Precertification Inquiry](https://account.eligible.com/rest#precert_inquiry)

```js
eligible.Precertification.inquiry({
  payer_id: '60054',
  payer_name: 'Aetna',
  provider_type: 'attending',
  provider_last_name: 'Doe',
  provider_first_name: 'John',
  provider_npi: '0123456789',
  provider_phone_number: '1234567890',
  provider_taxonomy_code: '291U00000X',
  member_id: 'ZZZ445554301',
  member_first_name: 'IDA',
  member_last_name: 'FRANKLIN',
  member_dob: '1701-12-12',
  from_date: '2014-01-01',
  to_date: '2015-01-01',
})
.then(function(precert) {
})
.catch(done);
```

#### [Create A Precertification](https://account.eligible.com/rest#precert_creation)

```js
eligible.Precertification.create(params) // example params can be found in the REST document of this endpoint
  .then(function(precert) {
  })
  .catch(done);
```

### x12

#### Simple Post

```js
eligible.config.setApiVersion('v1.1');
eligible.X12.post(params)//
  .then(function(x12) {
  })
  .catch(done);
```

#### MIME Post

```js
eligible.config.setApiVersion('v1.1');
eligible.X12.mimePost(params)//
  .then(function(x12) {
  })
  .catch(done);
```

### Tickets

#### Create a Ticket

```js
eligible.Ticket.create(params)
  .then(function(ticket) {

  })
  .catch();
```

#### View a Ticket

```js
eligible.Ticket.retrieve('123')
  .then(function(ticket) {

  })
  .catch();
```


#### Update a Ticket

```js
eligible.Ticket.update('123', params)
  .then(function(ticket) {

  })
  .catch();
```

#### List Tickets

```js
eligible.Ticket.list()
  .then(function(data) {

  })
  .catch();
```

#### Create a Ticket Comment

```js
eligible.Ticket.createComment('123', params)
  .then(function(comment) {

  })
  .catch();
```

#### List Comments for a Ticket

```js
eligible.Ticket.comments('123')
  .then(function(comments) {

  })
  .catch();
```

## Errors

The library throws following error objects.

- Eligible.APIConnectionError
- Eligible.APIResponseError
- Eligible.APIError
- Eligible.AuthenticationError
- Eligible.InvalidRequestError

The following table describes the properties of the error object.

|  Property  |       Type       |                             Description                             |
|:----------:|:----------------:|:-------------------------------------------------------------------:|
| `message`  | string           | The error message                                                   |
| `code`     | number           | When the error occurs during an HTTP request, the HTTP status code. |
| `response` | object or string | HTTP response as JSON, if JSON not available raw response is stored |


To catch individual errors, use [bluebird catch syntax](http://bluebirdjs.com/docs/api/catch.html).


## Testing

Use the following commands to run tests or test coverage:

```sh
ELIGIBLE_API_KEY=API_KEY npm test
ELIGIBLE_API_KEY=API_KEY npm run coverage
```

Note that, by default running above commands will mock HTTP requests using [nock](https://github.com/pgte/nock) library. To disable mocking and make actaul calls against eligible server, pass `NOCK_OFF=true` enviroment variable:

`NOCK_OFF=true npm test`

To filter tests, update `grep` field in `test/mocha.opts`.

## Developing

To work on the library:

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Install dependencies: `npm install`
4. Fix bugs or add features. Make sure the changes pass the coding guidelines by runing: `npm run lint` or `npm run watch`
5. Write tests for your new features. For HTTP mocking [`nock`](https://github.com/pgte/nock) library is used. Nock definitions are saved in `test/fixtures` directory
6. Run test by `npm test` or `npm run coverage`
7. If all tests are passed, push to the branch (git push origin my-new-feature)
8. Create new Pull Request

## Support Forums

If you find an issue with in the client library we would appricate you Send an email to support@eligible.com or add an issue in the [Issue tracker](https://github.com/eligible/eligible-node/issues) for bug reports.
