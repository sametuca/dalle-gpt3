import { Dalle } from "dalle-node";

export default async function handler(req, res) {
  NProgress.start();
  const dalle = new Dalle(req.query.k);
  const generations = await dalle.generate(req.query.q);
  console.log(generations);
  NProgress.done(true);
  res.status(200).json({ result: generations })
}