#!/usr/bin/env node

const scrape = require('website-scraper')
const package = require('./package')
const {join} = require('path')
const url = require('url')
const httpResponseHandler = require('website-scraper-phantom')

const cli = require('commander')
  .version(package.version)
  .option('-d, --depth <number>', 'max recursive depth', x => +x, 5)
  .option('-o, --output <path>', 'output dir', path => join(process.cwd(), path), '')

const CHROME_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3403.0 Safari/537.36'

async function main(argv) {
  cli.parse(argv)

  console.log('scraping:', cli.args, 'to:', cli.output)
  const urls = cli.args
  return scrape({
    urls,
    directory: cli.output,
    recursive: true,
    maxDepth: cli.depth,
    urlFilter: u => urls.some(x => u.indexOf(x) !== -1) || u.indexOf('static') !== -1,
    request: {
      headers: {
        'User-Agent': CHROME_UA,
      }      
    },
    httpResponseHandler,
  })
}

if (module === require.main) {
  main(process.argv)
    .catch(console.error)
}