// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import clientPromise from "../../../../lib/mongodb";


type Data = {
  status: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    query: { id, name },
    method,
    body
  } = req

  switch (method) {
    case 'POST':
      // Get data from your database

      if (body['prompt'] === undefined) {
        res.status(400).end('Prompt is missing')
        break
      }
      if (body['prompt_strength'] === undefined) {
        res.status(400).end('Prompt strength is missing')
        break
      }
      if (body['inference_steps'] === undefined) {
        res.status(400).end('Inference steps is missing')
        break
      }
      if (body['guidance_scale'] === undefined) {
        res.status(400).end('Guidance scale is missing')
        break
      }
      if (body['scheduler'] === undefined) {
        res.status(400).end('Scheduler is missing')
        break
      }

      // @ts-ignore
      const client = await clientPromise;
      const db = client.db("holler");
      const collection = db.collection("queue");
      const _uid = await collection.count() + 1;
      // {"_id":{"$oid":"639ca9fccf87a5419599038f"},"json":{"prompt":"man on the moon","negative_prompt":"","prompt_strength":{"$numberDouble":"0.8"},"inference_steps":{"$numberLong":"10"},"guidance_scale":{"$numberLong":"1"},"scheduler":"ddim","seed":{"$numberLong":"12"}},"status":"pending","created_at":{"$timestamp":{"t":0,"i":1671211533}},"updated_at":{"$timestamp":{"t":0,"i":1671211533}}}
      const result = await collection.insertOne({
          json: {
              prompt: body['prompt'],
              negative_prompt: body['negative_prompt'] || "",
              prompt_strength: body['prompt_strength'],
              inference_steps: body['inference_steps'],
              guidance_scale: body['guidance_scale'],
              scheduler: body['scheduler'],
              seed: 1
          },
          status: "pending",
          created_at: new Date(),
          updated_at: new Date(),
          uid: _uid,
      });
      await result;
      res.status(200).json({status: "added"})
      
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
