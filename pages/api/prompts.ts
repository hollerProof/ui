// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import clientPromise from "../../lib/mongodb";


type Prompts = {
  name: string,
  image: string,
  tags: string[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Prompts>
) {
    const {
        query: {id, name},
        method,
        body
    } = req

    switch (method) {
        case 'GET':
            let prompts;
            try {
                // @ts-ignore
                const client = await clientPromise;
                const db = client.db("holler");

                prompts = await db
                    .collection("prompts_public")
                    .find({})
                    .sort({updated_at: -1})
                    .limit(10)
                    .toArray();

                res.status(200).json(prompts);
            } catch (e) {
                console.error(e);
            }
            // res.status(200).json()

            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
