import json
import random
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def generate_qa():
    client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))
    
    with open('data/processed/processed/chunked_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # sample 10 chunks randomly
    sample_chunks = random.sample(data, min(10, len(data)))
    
    eval_data = []
    
    for idx, chunk in enumerate(sample_chunks):
        text = chunk['text']
        metadata = chunk['metadata']
        
        prompt = f"""
        Given the following text from a banking document, please generate a single, highly specific question that can be answered using *only* this text. Then, provide the detailed answer.
        Format your response exactly like this:
        Question: [Your question]
        Answer: [Your answer]
        
        Text:
        {text}
        """
        
        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="openai/gpt-oss-120b",
                temperature=0.1
            )
            output = response.choices[0].message.content.strip()
            
            # parse Question and Answer
            q_part = output.split("Answer:")[0].replace("Question:", "").strip()
            a_part = output.split("Answer:")[1].strip() if "Answer:" in output else ""
            
            if q_part and a_part:
                eval_data.append({
                    "id": f"eval_{idx}",
                    "question": q_part,
                    "ground_truth_answer": a_part,
                    "ground_truth_context": text,
                    "ground_truth_doc_id": str(metadata.get('doc_id')),
                    "metadata": metadata
                })
                print(f"Generated QA pair {idx+1}/10")
        except Exception as e:
            import traceback
            error_msg = traceback.format_exc()
            print(f"Error generating QA for chunk {idx}: {e}")
            with open('groq_error.txt', 'w') as err_f:
                err_f.write(error_msg)
            break
            
    with open('data/eval_qa.json', 'w', encoding='utf-8') as f:
        json.dump(eval_data, f, indent=2)
        
    print(f"Saved {len(eval_data)} QA pairs to data/eval_qa.json")

if __name__ == "__main__":
    generate_qa()
