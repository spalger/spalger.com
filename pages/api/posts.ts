import {
  makeNextHandler,
  NextRoute,
  parseIntQueryValue,
} from '@spalger/next-plus'

import { POSTS, PostsListResp } from '../../model/posts'
import { injectSiteUrl } from '../../model/post'
import { getSiteUrl } from '../../model/url'

const VISIBLE_POSTS = POSTS.filter(p => !p.hide)

export default makeNextHandler([
  new NextRoute('GET', ctx => {
    const siteUrl = getSiteUrl(ctx.headers)
    const pageNum = parseIntQueryValue(ctx.query, 'page', 1)
    const perPage = parseIntQueryValue(ctx.query, 'perPage', 10)

    const startI = (pageNum - 1) * perPage
    const total = VISIBLE_POSTS.length

    const body: PostsListResp = {
      total,
      posts: VISIBLE_POSTS.slice(startI, startI + perPage).map(p =>
        injectSiteUrl(p, siteUrl),
      ),
    }

    return {
      body,
    }
  }),
])
