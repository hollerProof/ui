// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

type PromptStatus = {
    id: number,
    status: string
}

const prompts = [
    {
        id: 1,
        status: 'queued'
    },
    {
        id: 2,
        status: 'proved'
    },
    {
        id: 3,
        status: 'rejected'
    }
]

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<PromptStatus>
) {
    const {pid} = req.query


    switch (req.method) {
        case 'GET':

            // @ts-ignore
            var prompt = prompts.find(obj => obj.id === parseInt(pid))
            if (prompt === undefined) {
                res.status(400).end('Prompt id is not present')
                break
            }
            res.status(200).json(prompt)
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
