# evaluation/run_pipeline.py

import json
import requests

CHATBOT_URL  = "http://localhost:8000/api/v1/chat"
EVAL_USER_ID = "ragas_evaluation_bot"

def run_pipeline_on_dataset(dataset_path, output_path):

    with open(dataset_path, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    questions    = dataset["question"]
    ground_truth = dataset["ground_truth"]

    answers  = []
    contexts = []
    total    = len(questions)

    print(f"Total questions : {total}")
    print(f"Chatbot URL     : {CHATBOT_URL}\n")

    for i, question in enumerate(questions):
        print(f"[{i+1}/{total}] {question[:60]}...")

        try:
            response = requests.post(
                CHATBOT_URL,
                json={
                    "user_id": EVAL_USER_ID,
                    "query"  : question
                },
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()

                answer  = result.get("answer", "")
                sources = result.get("sources", [])

                # Extract chunk texts from sources
                chunk_texts = [
                    s.get("chunk_text", "")
                    for s in sources
                    if s.get("chunk_text", "").strip()
                ]

                # Fallback — if chunk_text still empty
                if not chunk_texts:
                    chunk_texts = [answer]

                answers.append(answer)
                contexts.append(chunk_texts)

                confidence = result.get("confidence", 0.0)
                print(f"  ✅ Chunks: {len(chunk_texts)} | "
                      f"Confidence: {confidence:.1%} | "
                      f"Answer: {answer[:40]}...")

            elif response.status_code == 400:
                print(f"  ⚠️  Blocked by guardrails")
                answers.append("Blocked by guardrails")
                contexts.append([])

            else:
                print(f"  ❌ HTTP {response.status_code}")
                answers.append("")
                contexts.append([])

        except requests.exceptions.ConnectionError:
            print(f"  ❌ Chatbot not reachable — is it running?")
            answers.append("")
            contexts.append([])

        except Exception as e:
            print(f"  ❌ Error: {e}")
            answers.append("")
            contexts.append([])

    # Save
    output = {
        "question"    : questions,
        "ground_truth": ground_truth,
        "answer"      : answers,
        "contexts"    : contexts
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    success = len([a for a in answers if a
                   and a != "Blocked by guardrails"])
    blocked = len([a for a in answers
                   if a == "Blocked by guardrails"])
    failed  = len([a for a in answers if not a])

    print(f"\n{'='*50}")
    print(f"PIPELINE COMPLETE")
    print(f"{'='*50}")
    print(f"Total     : {total}")
    print(f"Success   : {success}")
    print(f"Blocked   : {blocked}")
    print(f"Failed    : {failed}")
    print(f"Output    : {output_path}")

if __name__ == "__main__":
    run_pipeline_on_dataset(
        dataset_path = "apex_bank_golden_dataset_ragas.json",
        output_path  = "filled_dataset.json"
    )