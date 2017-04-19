/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sitemap              ->  index
 */
'use strict';
import sm from 'sitemap';
import Posts from '../posts/posts.model';

const basicMap = {
  hostname: 'http://www.rogatis.eti.br',
  cacheTime: 600000, // 600 sec cache peåriod
  urls: [
    {
      url: '/',
      changefreq: 'daily',
      priority: 0.3
    },
    {
      url: '/porfolio',
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: '/blog',
      changefreq: 'daily',
      priority: 0.5
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: 0.7
    }
  ]
};

const sitemap = res => {
  Posts.find().exec()
    .then(posts => {
      let map = sm.createSitemap(basicMap);
      posts.map(post => map.add({ url: `/${post.slug}` }));
      map.toXML((err, xml) => {
        if(!err) {
          console.log(err, xml);
        }
      });
      return res.status(200).header('Content-Type', 'application/xml')
        .send(map.toString());
    });
};

// Gets a site map
export const index = (req, res) => sitemap(res);

