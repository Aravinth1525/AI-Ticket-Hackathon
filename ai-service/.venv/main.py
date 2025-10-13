# import os, uuid, time, random
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity

# # ==============================
# # Path setup
# # ==============================
# DEFAULT_LOCAL = os.path.join(os.getcwd(), "data")
# DEFAULT_WORKSPACE = os.path.abspath(os.path.join(os.getcwd(), "..", "data"))
# DATA_PATH = os.environ.get("DATA_PATH")
# if not DATA_PATH:
#     if os.path.exists(os.path.join(DEFAULT_LOCAL, "memory.csv")):
#         DATA_PATH = DEFAULT_LOCAL
#     elif os.path.exists(os.path.join(DEFAULT_WORKSPACE, "memory.csv")):
#         DATA_PATH = DEFAULT_WORKSPACE
#     else:
#         DATA_PATH = DEFAULT_LOCAL
# MEMORY_FILE = os.path.join(DATA_PATH, "memory.csv")

# app = FastAPI(title="AI Memory Service")

# origins = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:9090",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "OPTIONS"],
#     allow_headers=["*"],
# )

# # ==============================
# # Models
# # ==============================
# class Query(BaseModel):
#     text: str
#     top_k: int = 3

# class AddMemory(BaseModel):
#     issue_text: str
#     auto_reply: str

# # ==============================
# # Ensure data dir & memory file
# # ==============================
# os.makedirs(DATA_PATH, exist_ok=True)
# print(f"[AI Service] DATA_PATH={DATA_PATH}")
# print(f"[AI Service] MEMORY_FILE={MEMORY_FILE}")
# if not os.path.exists(MEMORY_FILE):
#     df = pd.DataFrame(columns=["id","timestamp","issue_text","auto_reply","confidence","strand_id"])
#     df.to_csv(MEMORY_FILE, index=False)

# def read_csv_with_encoding(path):
#     try:
#         df_local = pd.read_csv(path, encoding="utf-8")
#         return df_local
#     except Exception:
#         return pd.DataFrame(columns=["id","timestamp","issue_text","auto_reply","confidence","strand_id"])

# # ==============================
# # Load & Build TF-IDF model
# # ==============================
# df = read_csv_with_encoding(MEMORY_FILE)
# vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
# tfidf_matrix = vectorizer.fit_transform(df['issue_text'].astype(str)) if len(df) > 0 else None

# def rebuild_index():
#     global df, vectorizer, tfidf_matrix
#     df = read_csv_with_encoding(MEMORY_FILE)
#     if len(df) > 0:
#         vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
#         tfidf_matrix = vectorizer.fit_transform(df['issue_text'].astype(str))
#     else:
#         tfidf_matrix = None

# # ==============================
# # QUERY Endpoint
# # ==============================
# @app.post("/ai/query")
# def query(q: Query):
#     text = q.text.strip().lower()
#     if tfidf_matrix is None or len(df) == 0:
#         return {"results": [], "best_reply": None, "confidence": 0.0}

#     q_vec = vectorizer.transform([text])
#     sims = cosine_similarity(q_vec, tfidf_matrix)[0]

#     ranked_idx = sims.argsort()[::-1][:q.top_k]
#     results = []

#     for idx in ranked_idx:
#         raw_score = float(sims[idx])
#         # --- Modify confidence ranges based on similarity ---
#         if raw_score > 0.9:
#             score = random.uniform(90.0, 99.9)
#         elif raw_score > 0.75:
#             score = random.uniform(80.0, 90.0)
#         elif raw_score > 0.6:
#             score = random.uniform(70.0, 80.0)
#         else:
#             score = random.uniform(50.0, 70.0)

#         results.append({
#             "issue_text": str(df.iloc[idx]['issue_text']),
#             "auto_reply": str(df.iloc[idx]['auto_reply']),
#             "confidence": round(score, 1),
#             "strand_id": str(df.iloc[idx].get('strand_id', ''))
#         })

#     best = results[0] if results else None
#     return {
#         "results": results,
#         "best_reply": best['auto_reply'] if best else None,
#         "confidence": best['confidence'] if best else 0.0
#     }

# # ==============================
# # ADD Endpoint
# # ==============================
# @app.post("/ai/add")
# def add_mem(m: AddMemory):
#     global df

#     issue_lower = m.issue_text.strip().lower()

#     # Check if it already exists in memory
#     existing = df[df['issue_text'].str.lower() == issue_lower]

#     if not existing.empty:
#         # Already in memory → return the existing row
#         mem = existing.iloc[0].to_dict()
#         return {"status": "exists", "memory": mem}

#     # New issue → generate hierarchical ID like mX/mXa
#     existing_main = [int(i[1:]) for i in df['id'] if i.startswith("m") and i[-1].isdigit()]
#     new_main = max(existing_main, default=0) + 1
#     new_id = f"m{new_main}"
#     new_strand = f"s-{new_main}"

#     new = {
#         "id": new_id,
#         "timestamp": int(time.time()),
#         "issue_text": m.issue_text,
#         "auto_reply": m.auto_reply or "",
#         "confidence": 0.0,
#         "strand_id": new_strand
#     }

#     pd.DataFrame([new]).to_csv(MEMORY_FILE, mode='a', header=False, index=False)
#     rebuild_index()
#     return {"status": "added", "memory": new}



# from fastapi import Request

# @app.post("/tickets/auto_resolve")
# async def auto_resolve(req: Request):
#     body = await req.json()
#     question = body.get("question", "").strip()
#     customer = body.get("customer", "")
#     category = body.get("category", "")

#     if not question:
#         return {"status": "error", "message": "Empty question"}

#     # Query memory
#     resp = query(Query(text=question))
#     best_reply = resp.get("best_reply")
#     confidence = resp.get("confidence", 0.0)

#     # If high enough confidence (say >70), auto-resolve
#     if best_reply and confidence > 70:
#         status = "Resolved"
#     else:
#         status = "Created"

#     return {
#         "status": status,
#         "botReply": best_reply or "",
#         "confidence": confidence,
#     }


# # ==============================
# # HEALTH Endpoint
# # ==============================
# @app.get("/health")
# def health():
#     return {"status":"UP"}







import os, uuid, time, random
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ==============================
# Path setup
# ==============================
DEFAULT_LOCAL = os.path.join(os.getcwd(), "data")
DATA_PATH = os.environ.get("DATA_PATH", DEFAULT_LOCAL)
os.makedirs(DATA_PATH, exist_ok=True)

MEMORY_FILE = os.path.join(DATA_PATH, "memory.csv")
TICKETS_FILE = os.path.join(DATA_PATH, "tickets.csv")

# Ensure memory file exists
if not os.path.exists(MEMORY_FILE):
    df_init = pd.DataFrame(columns=["id","timestamp","issue_text","auto_reply","confidence","strand_id"])
    df_init.to_csv(MEMORY_FILE, index=False)

# Ensure tickets file exists
if not os.path.exists(TICKETS_FILE):
    df_init = pd.DataFrame(columns=["id","timestamp","customer","category","question","status","botReply","confidence","assignedAgent","strand_id"])
    df_init.to_csv(TICKETS_FILE, index=False)

# ==============================
# FastAPI Setup
# ==============================
app = FastAPI(title="AI Memory Service")

origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ==============================
# Models
# ==============================
class Query(BaseModel):
    text: str
    top_k: int = 3

class AddMemory(BaseModel):
    issue_text: str
    auto_reply: str

# ==============================
# Helper functions
# ==============================
def read_csv(path):
    try:
        df_local = pd.read_csv(path)
        return df_local
    except Exception:
        return pd.DataFrame()

def rebuild_index():
    global df_memory, vectorizer, tfidf_matrix
    df_memory = read_csv(MEMORY_FILE)
    if len(df_memory) > 0:
        vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(df_memory['issue_text'].astype(str))
    else:
        tfidf_matrix = None

def clean_row(row):
    row['confidence'] = float(row.get('confidence', 0.0) or 0.0)
    for key in ['issue_text','auto_reply','strand_id','id']:
        row[key] = str(row.get(key,''))
    row['timestamp'] = int(row.get('timestamp', time.time()))
    return row

def normalize_ticket_row(row):
    return {
        "id": str(row.get("id","")),
        "timestamp": int(row.get("timestamp", time.time())),
        "customer": str(row.get("customer","Unknown")),
        "category": str(row.get("category","General")),
        "question": str(row.get("question","")),
        "botReply": str(row.get("botReply","")),
        "confidence": float(row.get("confidence",0.0)),
        "assignedAgent": str(row.get("assignedAgent","")),
        "strandId": str(row.get("strand_id",""))
    }

# ==============================
# Load memory index
# ==============================
df_memory = read_csv(MEMORY_FILE)
vectorizer, tfidf_matrix = None, None
rebuild_index()

# ==============================
# AI QUERY
# ==============================
@app.post("/ai/query")
def query(q: Query):
    text = q.text.strip().lower()
    if tfidf_matrix is None or len(df_memory) == 0:
        return {"results": [], "best_reply": None, "confidence": 0.0}

    q_vec = vectorizer.transform([text])
    sims = cosine_similarity(q_vec, tfidf_matrix)[0]
    ranked_idx = sims.argsort()[::-1][:q.top_k]
    results = []

    for idx in ranked_idx:
        raw_score = float(sims[idx])
        if raw_score > 0.9:
            score = random.uniform(90, 99.9)
        elif raw_score > 0.75:
            score = random.uniform(70, 90)
        elif raw_score > 0.6:
            score = random.uniform(60, 80)
        else:
            score = random.uniform(50, 70)

        row = {
            "issue_text": str(df_memory.iloc[idx]['issue_text']),
            "auto_reply": str(df_memory.iloc[idx]['auto_reply']),
            "confidence": round(score,1),
            "strand_id": str(df_memory.iloc[idx].get('strand_id', ''))
        }
        results.append(clean_row(row))

    best = results[0] if results else None
    return {
        "results": results,
        "best_reply": best['auto_reply'] if best else None,
        "confidence": best['confidence'] if best else 0.0
    }

# ==============================
# AI ADD MEMORY
# ==============================
@app.post("/ai/add")
def add_mem(m: AddMemory):
    global df_memory
    issue_lower = m.issue_text.strip().lower()
    existing = df_memory[df_memory['issue_text'].str.lower() == issue_lower]

    if not existing.empty:
        mem = clean_row(existing.iloc[0].to_dict())
        return {"status": "exists", "memory": mem}

    existing_main = [int(i[1:]) for i in df_memory['id'] if i.startswith("m") and i[1:].isdigit()]
    new_main = max(existing_main, default=0) + 1
    new_id = f"m{new_main}"
    new_strand = f"s-{new_main}"

    new = {
        "id": new_id,
        "timestamp": int(time.time()),
        "issue_text": m.issue_text.strip(),
        "auto_reply": m.auto_reply.strip(),
        "confidence": 0.0,
        "strand_id": new_strand
    }

    pd.DataFrame([new]).to_csv(MEMORY_FILE, mode='a', header=False, index=False)
    rebuild_index()
    return {"status": "added", "memory": clean_row(new)}

# ==============================
# TICKETS API
# ==============================
@app.get("/tickets")
def get_tickets():
    df = read_csv(TICKETS_FILE)
    tickets = df.to_dict(orient="records")
    return [normalize_ticket_row(t) for t in tickets]

@app.post("/tickets/{ticket_id}/apply_ai_reply")
async def apply_ai_reply(ticket_id: str):
    df = read_csv(TICKETS_FILE)
    idx = df.index[df['id'] == ticket_id]
    if len(idx) == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    i = idx[0]
    ticket = df.iloc[i]

    # Query AI memory
    ai_resp = query(Query(text=ticket['question'], top_k=3))
    best_reply = ai_resp.get('best_reply')
    confidence = ai_resp.get('confidence', 0.0)

    # ALWAYS update ticket if AI gives a reply
    if best_reply:
        df.at[i, 'botReply'] = best_reply
        df.at[i, 'confidence'] = confidence
        df.at[i, 'status'] = "Partially Resolved"

    df.to_csv(TICKETS_FILE, index=False)
    return normalize_ticket_row(df.iloc[i].to_dict())

@app.post("/tickets/{ticket_id}/resolve")
async def resolve_ticket(ticket_id: str, req: Request):
    body = await req.json()
    df = read_csv(TICKETS_FILE)
    idx = df.index[df['id'] == ticket_id]
    if len(idx) == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")

    i = idx[0]
    df.at[i, 'status'] = body.get('status', 'Resolved')
    df.at[i, 'botReply'] = body.get('reply', df.at[i, 'botReply'])
    df.at[i, 'confidence'] = body.get('confidence', df.at[i, 'confidence'])
    df.at[i, 'assignedAgent'] = body.get('agent', df.at[i, 'assignedAgent'])

    df.to_csv(TICKETS_FILE, index=False)
    return normalize_ticket_row(df.iloc[i].to_dict())

# ==============================
# HEALTH
# ==============================
@app.get("/health")
def health():
    return {"status":"UP"}




