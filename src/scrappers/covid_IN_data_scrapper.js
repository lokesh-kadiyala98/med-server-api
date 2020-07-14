const cheerio = require('cheerio')
const request = require('request')

const covid_IN_data_scrapper = () => {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: 'https://www.mohfw.gov.in/#state-data'
        }, async (err, res, body) => {
            if (err) 
                reject(err)
            
            let $ = cheerio.load(body)
            let data = []
            let obj = {}
            let iterator = 0
            $('.table-striped tbody tr td').each(function(i) {
                if(i % 6 === 1)
                    obj.state = $(this).text().trim()
                else if(i % 6 === 2)
                    obj['cases'] = $(this).text().trim()
                else if(i % 6 === 3)
                    obj['cured'] = $(this).text().trim()
                else if(i % 6 === 4) {
                    obj['deceased'] = $(this).text().trim()
                    iterator += 6
                    data.push(obj)
                    obj = {}
                }
            })
            resolve({ status: 200, data })
        })
    })
}

module.exports = covid_IN_data_scrapper