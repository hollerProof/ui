
import { Flex, Box, FormControl, FormLabel, FormHelperText, Input, Select } from "@chakra-ui/react";
import { useState } from "react";

export default function CreatePromptForm() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [promptStrength, setPromptStrength] = useState(0);
  const [numInferenceSteps, setNumInferenceSteps] = useState(1);
  const [guidanceScale, setGuidanceScale] = useState(1);
  const [scheduler, setScheduler] = useState("");


  return (
    <Flex flexDir={'column'} gap={4}>
        <FormControl>
          <FormLabel htmlFor="prompt">Prompt</FormLabel>
          <Input
            type="text"
            id="prompt"
            placeholder="Enter a prompt"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="negative-prompt">Negative Prompt</FormLabel>
          <Input
            type="text"
            id="negative-prompt"
            placeholder="Enter a negative prompt"
            value={negativePrompt}
            onChange={e => setNegativePrompt(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="prompt-strength">Prompt Strength</FormLabel>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.01}
            id="prompt-strength"
            value={promptStrength}
            onChange={e => setPromptStrength(parseFloat(e.target.value))}
          />
          <FormHelperText textAlign={'right'}>Max value: 1</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="num-inference-steps">Number of Inference Steps</FormLabel>
          <Input
            type="number"
            min={1}
            max={500}
            id="num-inference-steps"
            value={numInferenceSteps}
            onChange={e => setNumInferenceSteps(parseInt(e.target.value))}
          />
          <FormHelperText textAlign={'right'} >Minimum: 1; Maximum: 500</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="guidance-scale">Guidance Scale</FormLabel>
          <Input
            type="number"
            min={1}
            max={20}
            id="guidance-scale"
            value={guidanceScale}
            onChange={e => setGuidanceScale(parseFloat(e.target.value))}
          />
          <FormHelperText textAlign={'right'} >Minimum: 1; Maximum: 20</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="scheduler">Scheduler</FormLabel>
          <Select
            id="scheduler"
            placeholder="Select a scheduler"
            value={scheduler}
            onChange={e => setScheduler(e.target.value)}
          >
          <option value='ddim'>DDIM</option>
          <option value='k_euler'>K_EULER</option>
          <option value='dpmsolver_multistep'>DPMSolverMultistep</option>
          </Select>
        </FormControl>
    </Flex>)}
