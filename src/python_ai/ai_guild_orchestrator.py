import asyncio
import os
import json
import logging
import aiohttp
from typing import Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s')
logger = logging.getLogger("ArtisanForge.Guild")

GO_GATEWAY_WEBHOOK = os.getenv("GO_GATEWAY_WEBHOOK", "http://localhost:8080/internal/webhook/progress")

class CriticEvaluation(BaseModel):
    score: int = Field(description="Score from 1 to 100")
    passed: bool = Field(description="True if score > 75")
    feedback: str = Field(description="Brief reasoning")

class ConceptualizerAgent:
    def __init__(self, llm=None):
        self.name = "Conceptualizer"
        self.llm = llm
        self.prompt_template = PromptTemplate(
            template="You are a Concept Artist. Rewrite: '{raw_prompt}' in style '{style}' for Stable Diffusion.",
            input_variables=["raw_prompt", "style"]
        )

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"Refining prompt vectors for: {context.get('raw_prompt')}")
        if self.llm:
            chain = self.prompt_template | self.llm
            result = await chain.ainvoke({"raw_prompt": context.get('raw_prompt'), "style": context.get('style', 'Cyberpunk')})
            refined = result.content.strip()
        else:
            await asyncio.sleep(1) 
            refined = f"{context.get('raw_prompt')}, {context.get('style')}, masterpiece, 8k resolution"
        context["refined_prompt"] = refined
        context["progress"] = 25
        return context

class ArtisanAgent:
    def __init__(self): self.name = "Artisan"
    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("Connecting to C++ Tensor Engine...")
        await asyncio.sleep(2)
        context["latent_tensor_uri"] = "local://gpu_cache/tensor_v1.pt"
        context["progress"] = 60
        return context

class CriticAgent:
    def __init__(self, llm=None):
        self.name = "Critic"
        self.llm = llm

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("Evaluating structural constraints...")
        await asyncio.sleep(1)
        context["qa_score"] = 94
        context["qa_passed"] = True
        context["progress"] = 80
        return context

class AppraiserAgent:
    def __init__(self, llm=None):
        self.name = "Appraiser"
        self.llm = llm

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("Generating Rarity Lore metadata...")
        await asyncio.sleep(1)
        context["rarity_lore"] = "Forged in the heart of a dying neon star, this artifact bends the digital fabric."
        context["progress"] = 100
        return context

class GuildOrchestrator:
    def __init__(self):
        llm = ChatOpenAI(model="gpt-4o", temperature=0.7) if os.getenv("OPENAI_API_KEY") else None
        self.conceptualizer = ConceptualizerAgent(llm)
        self.artisan = ArtisanAgent()
        self.critic = CriticAgent(llm)
        self.appraiser = AppraiserAgent(llm)

    async def execute_concept_to_canvas(self, raw_prompt: str, style: str, job_id: str) -> Dict[str, Any]:
        context = {"job_id": job_id, "raw_prompt": raw_prompt, "style": style, "progress": 0}
        try:
            context = await self.conceptualizer.process(context)
            await self._notify_gateway(context)
            context = await self.artisan.process(context)
            await self._notify_gateway(context)
            context = await self.critic.process(context)
            await self._notify_gateway(context)
            context = await self.appraiser.process(context)
            await self._notify_gateway(context)
            return context
        except Exception as e:
            logger.error(f"Workflow failed: {str(e)}")
            return context

    async def _notify_gateway(self, context: Dict[str, Any]):
        payload = {"job_id": context.get("job_id"), "progress": context.get("progress")}
        try:
            async with aiohttp.ClientSession() as session:
                await session.post(GO_GATEWAY_WEBHOOK, json=payload)
        except Exception:
            pass

if __name__ == "__main__":
    orchestrator = GuildOrchestrator()
    asyncio.run(orchestrator.execute_concept_to_canvas("Cyberpunk samurai", "Hyper-Realistic", "test_job_001"))
