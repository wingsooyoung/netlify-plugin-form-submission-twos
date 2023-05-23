const fs      = require('fs');
const fetch   = require('node-fetch');
const chalk   = require('chalk');


// gather our environment variables
require('dotenv').config()
const {
  NETLIFY_AUTH_TOKEN
} = process.env;

let formIDs = {};


const getFormSubmissions = async function(formName, path) {
  let formID = formIDs[formName];

  const submissions = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=1&per_page=100`)
      .then(res => JSON.stringify(res.json()))
  await fs.writeFileSync(path, JSON.stringify(submissions));

  try {
    //code
    var page2 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=2&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
          if (res.length === 0){
            throw new Error("-twos error message, next page empty")
          } else {
            return res
          }
        }
        )
    var page3 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=3&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
              if (res.length === 0){
                throw new Error("-twos error message, next page empty")
              } else {
                return res
              }
            }
        )
    var page4 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=4&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
              if (res.length === 0){
                throw new Error("-twos error message, next page empty")
              } else {
                return res
              }
            }
        )
    var page5 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=5&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
              if (res.length === 0){
                throw new Error("-twos error message, next page empty")
              } else {
                return res
              }
            }
        )
    var page6 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=6&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
              if (res.length === 0){
                throw new Error("-twos error message, next page empty")
              } else {
                return res
              }
            }
        )
    var page7 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=7&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
              if (res.length === 0){
                throw new Error("-twos error message, next page empty")
              } else {
                return res
              }
            }
        )
    var page8 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=8&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
              if (res.length === 0){
                throw new Error("-twos error message, next page empty")
              } else {
                return res
              }
            }
        )
    var page9 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=9&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
              if (res.length === 0){
                throw new Error("-twos error message, next page empty")
              } else {
                return res
              }
            }
        )
    var page10 = await fetch(`https://api.netlify.com/api/v1/forms/${formID}/submissions?access_token=${NETLIFY_AUTH_TOKEN}&state=ham&page=10&per_page=100`)
        .then(res => JSON.stringify(res.json()))
        .then((res) => {
              if (res.length === 0){
                throw new Error("-twos error message, next page empty")
              } else {
                return res
              }
            }
        )

  } catch (error) {

      console.log("e mes - "+ error)

  }


  const fsPromises = fs.promises;
  fsPromises.readFile(path, 'utf8')
      .then(data => {
        let json = JSON.parse(data);
        json.concat(page2, page3, page4, page5, page6, page7, page8, page9, page10);

        fsPromises.writeFile(path, JSON.stringify(json))
            .then(  () => { console.log('Append Success'); })
            .catch(err => { console.log("Append Failed: " + err);});
      })
      .catch(err => { console.log("Read Error: " +err);});




  console.log('Form submissions data saved:', chalk.yellow(path));
  // const arethesemysubs = await fs.readFileSync(path);
  // console.log(arethesemysubs.toString());
};


module.exports = {

  async onPreBuild({ inputs, utils, constants }) {


    // only proceed if an auth token has been set as an env var.
    if(!NETLIFY_AUTH_TOKEN){
      return utils.build.failPlugin(`The form-submission plugin requires access to the Netlify API via an NETLIFY_AUTH_TOKEN environment variable. Visit https://app.netlify.com/user/applications to create a personal access token and save it as an environment variable called NETLIFY_AUTH_TOKEN before retrying`);
    }

    // Fetch the data about what forms exist for this site
    const forms = await fetch(`https://api.netlify.com/api/v1/sites/${constants.SITE_ID}/forms?access_token=${NETLIFY_AUTH_TOKEN}`)
      .then(res => res.json())
      .catch(err => {
        utils.build.failPlugin(`Failed to get data about this site's forms from the Netlify API. Continuing with build, but form data may be missing which might cause problems.\n\n ${err}`);
      });

    // build an index object of the form names and their IDs
    console.log(chalk.green(`Forms found in the site: ${forms.length}`));

    // No forms? Nothing to do.
    if(!forms.length) {
      return;
    }

    // Output some form summary info for what we found
    forms.forEach(form => {
      console.log(chalk.green(form.name), `(${form.id})` );
      formIDs[form.name] = form.id;
    });

    // get submissions to specified forms or all forms?
    const chosenForms = inputs.formNames === 'ALL' ? Object.keys(formIDs) : [].concat(inputs.formNames)

    // get submissions to each form in parallel
    const promises = chosenForms.map((formName) => {
      const dataFilePath = `${inputs.dataDirectory}/${formName}_submissions.json`; //i could try changing this to have one file per page of 100 submissions??
      return getFormSubmissions(formName, dataFilePath)
    });

    await Promise.all(promises);


  }
}
