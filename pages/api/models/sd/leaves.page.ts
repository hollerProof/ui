// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
// @ts-ignore
import clientPromise from "../../../../lib/mongodb";

type Data = {
    leaves: number[],
    count: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const {
        query: {id, name},
        method,
        body
    } = req

    switch (method) {
        case 'GET':
            // Get data from your database
            let leaves;
            try {
                // @ts-ignore
                const client = await clientPromise;
                const db = client.db("holler");

                leaves = await db
                    .collection("prompts_public")
                    .find({})
                    .sort({uid: -1})
                    .toArray();
                leaves = leaves.map((leaf: any) => leaf.hash);
                res.status(200).json({leaves: leaves, count: leaves.length});
            } catch (e) {
                console.error(e);
            }
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
