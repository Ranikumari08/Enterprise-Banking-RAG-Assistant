import json
import os
import pandas as pd
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings

# ── Your Groq API key ──
GROQ_API_KEY = "your_groq_api_key_here"

def run_evaluation(filled_dataset_path, output_path):

    # Load filled dataset
    with open(filled_dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Questions  : {len(data['question'])}")
    print(f"Answers    : {len([a for a in data['answer'] if a])}")
    print(f"Contexts   : {len([c for c in data['contexts'] if c])}")

    # Remove failed rows (empty answer or empty context)
    clean_questions = []
    clean_answers   = []
    clean_contexts  = []
    clean_gt        = []

    for q, a, c, g in zip(
        data["question"],
        data["answer"],
        data["contexts"],
        data["ground_truth"]
    ):
        if a and c:  # only include rows with answer AND context
            clean_questions.append(q)
            clean_answers.append(a)
            clean_contexts.append(c)
            clean_gt.append(g)

    print(f"Clean rows : {len(clean_questions)}")
    print()

    # Build HuggingFace Dataset
    hf_dataset = Dataset.from_dict({
        "question"    : clean_questions,
        "answer"      : clean_answers,
        "contexts"    : clean_contexts,
        "ground_truth": clean_gt
    })

    # Setup LLM and embeddings
    llm = ChatGroq(
        model    = "llama3-8b-8192",
        api_key  = GROQ_API_KEY
    )

    embeddings = HuggingFaceEmbeddings(
        model_name = "all-MiniLM-L6-v2"
    )

    print("Running RAGAS evaluation...")
    print("This will take 5-10 minutes for 300 questions\n")

    results = evaluate(
        dataset    = hf_dataset,
        metrics    = [
            faithfulness,
            answer_relevancy,
            context_precision,
            context_recall
        ],
        llm        = llm,
        embeddings = embeddings
    )

    # Print summary scores
    print()
    print("=" * 50)
    print("RAGAS EVALUATION RESULTS")
    print("=" * 50)
    print(f"Faithfulness       : {results['faithfulness']:.4f}")
    print(f"Answer Relevancy   : {results['answer_relevancy']:.4f}")
    print(f"Context Precision  : {results['context_precision']:.4f}")
    print(f"Context Recall     : {results['context_recall']:.4f}")
    print("=" * 50)

    # Save detailed per-question results
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df = results.to_pandas()
    df.to_csv(output_path, index=False)

    print(f"\nDetailed results saved to: {output_path}")

if __name__ == "__main__":
    run_evaluation(
        filled_dataset_path = "filled_dataset.json",
        output_path         = "results/ragas_scores.csv"
    )