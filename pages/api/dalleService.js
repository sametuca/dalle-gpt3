import { Dalle } from "dalle-node";
import Link from 'next/link';
import NextNProgress from 'nextjs-progressbar';
import * as NProgress from 'nprogress';


export default async function handler(req, res) {
  NProgress.start();
  const dalle = new Dalle(req.query.k);
  const generations = await dalle.generate(req.query.q);
  console.log(generations);
  NProgress.done(true);
  res.status(200).json({ result: generations })
}