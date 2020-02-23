var sugar = require('sugar');
var request = require('../lib/rxrequest');
var filelisting = require('../lib/sites/filelisting');

module.exports = {
  id: 'voidlinux',
  name: 'Void Linux',
  tags: ['hybrid'],
  url: 'https://voidlinux.eu/',
  releases: filelisting.getEntries('https://a-hel-fi.m.voidlinux.eu/live/current/')
    .filter(entry => entry.type === 'file')
    .map(entry => {
      const match = /^void-live-(i686|x86_64)-(\d{8})(?:-\w+)?\.iso$/g.exec(entry.name)
      if (!match) return null
      return {
        url: entry.url,
        arch: match[1],
        version: match[2]
      }
    })
    .filter(entry => entry)
    .flatMap(release => request.contentlength(release.url)
      .map(contentLength => Object.merge(release, { size: contentLength }))
    )
};
