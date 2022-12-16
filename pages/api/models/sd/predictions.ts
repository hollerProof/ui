// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

type Data = {
    hash: string
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
            const replicateSecret = process.env['REPLICATE_KEY']
            const resp = await fetch("https://api.replicate.com/v1/predictions", {
                body: `{"version": "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c", "input": {"prompt": ${body['prompt']}, "prompt_strength": ${body['prompt_strength']},"inference_steps": ${body['inference_steps']},"guidance_scale": ${body['guidance_scale']},"scheduler": ${body['scheduler']}, "seed": 1}}`,
                headers: {Authorization: `Token ${replicateSecret}`, "Content-Type": "application/json"},
                method: "POST"
            })
            const json_resp = await resp.json();

            res.status(200).json({hash: JSON.stringify(json_resp)})


            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
