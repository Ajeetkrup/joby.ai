import os
from typing import TypedDict, Literal
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in .env file")

llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0.7, api_key=GROQ_API_KEY)

class AgentState(TypedDict):
    messages: list
    next_step: Literal["resume_check", "resume_maker", "cover_letter_writer", "FINISH"]
    user_input: str
    final_output: str

def router_node(state: AgentState):
    print("--- ROUTER AGENT ---")
    user_input = state["user_input"]

    system_prompt = (
        "You are a helpful router agent. Your job is to analyze the user's input, "
        "which contains job requirements and a specific task request. "
        "Determine if the user wants a 'Resume' or a 'Cover Letter'. "
        "Return ONLY the word 'resume' or 'cover_letter'."
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_input)
    ]

    response = llm.invoke(messages)
    decision = response.content.strip().lower()

    if "resume" in decision:
        return {"next_step": "resume_check"}
    elif "cover" in decision:
        return {"next_step": "cover_letter_writer"}
    else:
        return {"next_step": "FINISH", "final_output": "Could not determine intent."}

def resume_check_node(state: AgentState):
    print("--- RESUME CHECK AGENT ---")
    user_input = state["user_input"]

    prompt = (
        "You are a Resume Quality Checker. Analyze the following user input. "
        "Check if it contains sufficient information for: 1. Contact Info, 2. Skills, 3. Experience, 4. Education. "
        "If ANY of these are missing, list what is missing and ask the user to provide it. "
        "If ALL are present, return ONLY the word 'PROCEED'.\n\n"
        f"Input: {user_input}"
    )

    response = llm.invoke([HumanMessage(content=prompt)])
    content = response.content.strip()

    if "PROCEED" in content.upper():
        return {"next_step": "resume_maker"}
    else:
        return {"final_output": content, "next_step": "FINISH"}

def resume_maker_node(state: AgentState):
    print("--- RESUME MAKER AGENT ---")
    user_input = state["user_input"]

    prompt = (
        "You are an expert Resume Writer. "
        "Based on the following job requirements and user details, create a professional resume. "
        "Do not add anything if user has not given, if any section is missing ask from user and then only create the resume.\n\n"
        f"Input: {user_input}"
    )

    response = llm.invoke([HumanMessage(content=prompt)])
    return {"final_output": response.content, "next_step": "FINISH"}

def cover_letter_writer_node(state: AgentState):
    print("--- COVER LETTER WRITER AGENT ---")
    user_input = state["user_input"]

    prompt = (
        "You are an expert Cover Letter Writer. "
        "Based on the following job requirements and user details, write a compelling cover letter. "
        "Do not make things on your own, cover letter should be as per the user details.\n\n"
        f"Input: {user_input}"
    )

    response = llm.invoke([HumanMessage(content=prompt)])
    return {"final_output": response.content, "next_step": "FINISH"}

workflow = StateGraph(AgentState)

workflow.add_node("router", router_node)
workflow.add_node("resume_check", resume_check_node)
workflow.add_node("resume_maker", resume_maker_node)
workflow.add_node("cover_letter_writer", cover_letter_writer_node)

workflow.set_entry_point("router")

def route_decision(state: AgentState):
    return state["next_step"]

workflow.add_conditional_edges(
    "router",
    route_decision,
    {
        "resume_check": "resume_check",
        "cover_letter_writer": "cover_letter_writer",
        "FINISH": END
    }
)

workflow.add_conditional_edges(
    "resume_check",
    route_decision,
    {
        "resume_maker": "resume_maker",
        "FINISH": END
    }
)

workflow.add_edge("resume_maker", END)
workflow.add_edge("cover_letter_writer", END)

agent_app = workflow.compile()

async def run_agent(user_input: str) -> str:
    print(f"[agent] Processing query: {user_input[:100]}...")
    try:
        initial_state = {"user_input": user_input, "messages": []}
        result = agent_app.invoke(initial_state)
        output = result.get("final_output", "No output generated")
        print(f"[agent] SUCCESS: Generated output")
        return output
    except Exception as e:
        print(f"[agent] ERROR: {type(e).__name__}: {e}")
        raise

