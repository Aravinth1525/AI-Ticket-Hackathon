import os, uuid, time, random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ==============================
# Path setup
# ==============================
DEFAULT_LOCAL = os.path.join(os.getcwd(), "data")
DEFAULT_WORKSPACE = os.path.abspath(os.path.join(os.getcwd(), "..", "data"))
DATA_PATH = os.environ.get("DATA_PATH")
if not DATA_PATH:
    if os.path.exists(os.path.join(DEFAULT_LOCAL, "memory.csv")):
        DATA_PATH = DEFAULT_LOCAL
    elif os.path.exists(os.path.join(DEFAULT_WORKSPACE, "memory.csv")):
        DATA_PATH = DEFAULT_WORKSPACE
    else:
        DATA_PATH = DEFAULT_LOCAL
MEMORY_FILE = os.path.join(DATA_PATH, "memory.csv")

app = FastAPI(title="AI Memory Service")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:9090",
]
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
# Ensure data dir & memory file
# ==============================
os.makedirs(DATA_PATH, exist_ok=True)
print(f"[AI Service] DATA_PATH={DATA_PATH}")
print(f"[AI Service] MEMORY_FILE={MEMORY_FILE}")
if not os.path.exists(MEMORY_FILE):
    df = pd.DataFrame(columns=["id","timestamp","issue_text","auto_reply","confidence","strand_id"])
    df.to_csv(MEMORY_FILE, index=False)

def read_csv_with_encoding(path):
    try:
        df_local = pd.read_csv(path, encoding="utf-8")
        return df_local
    except Exception:
        return pd.DataFrame(columns=["id","timestamp","issue_text","auto_reply","confidence","strand_id"])

# ==============================
# Load & Build TF-IDF model
# ==============================
df = read_csv_with_encoding(MEMORY_FILE)
vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
tfidf_matrix = vectorizer.fit_transform(df['issue_text'].astype(str)) if len(df) > 0 else None

def rebuild_index():
    global df, vectorizer, tfidf_matrix
    df = read_csv_with_encoding(MEMORY_FILE)
    if len(df) > 0:
        vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(df['issue_text'].astype(str))
    else:
        tfidf_matrix = None

# ==============================
# QUERY Endpoint
# ==============================
@app.post("/ai/query")
def query(q: Query):
    text = q.text.strip().lower()
    if tfidf_matrix is None or len(df) == 0:
        return {"results": [], "best_reply": None, "confidence": 0.0}

    q_vec = vectorizer.transform([text])
    sims = cosine_similarity(q_vec, tfidf_matrix)[0]

    ranked_idx = sims.argsort()[::-1][:q.top_k]
    results = []

    for idx in ranked_idx:
        raw_score = float(sims[idx])
        # --- Modify confidence ranges based on similarity ---
        if raw_score > 0.9:
            score = random.uniform(90.0, 99.9)
        elif raw_score > 0.75:
            score = random.uniform(80.0, 90.0)
        elif raw_score > 0.6:
            score = random.uniform(70.0, 80.0)
        else:
            score = random.uniform(50.0, 70.0)

        results.append({
            "issue_text": str(df.iloc[idx]['issue_text']),
            "auto_reply": str(df.iloc[idx]['auto_reply']),
            "confidence": round(score, 1),
            "strand_id": str(df.iloc[idx].get('strand_id', ''))
        })

    best = results[0] if results else None
    return {
        "results": results,
        "best_reply": best['auto_reply'] if best else None,
        "confidence": best['confidence'] if best else 0.0
    }

# ==============================
# ADD Endpoint
# ==============================
@app.post("/ai/add")
def add_mem(m: AddMemory):
    new = {
        "id": str(uuid.uuid4()),
        "timestamp": int(time.time()),
        "issue_text": m.issue_text,
        "auto_reply": m.auto_reply,
        "confidence": 1.0,
        "strand_id": str(uuid.uuid4())
    }
    pd.DataFrame([new]).to_csv(MEMORY_FILE, mode='a', header=False, index=False)
    rebuild_index()
    return {"status": "ok", "added": new}

# ==============================
# HEALTH Endpoint
# ==============================
@app.get("/health")
def health():
    return {"status":"UP"}
